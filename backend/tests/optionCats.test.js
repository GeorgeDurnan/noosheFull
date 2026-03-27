// --- Core Dependencies ---
const request = require('supertest')
const app = require('../index.js')
const pool = require("../db.js")
require('dotenv').config()

// --- Shared State & Mock Data ---
// Initialize session agent and variables to track dynamically created categories
let agent
let id
let id2
const getId = 56 // Existing product ID (e.g., Saffron pistachio)
const fakeId = -1

// Import custom testing utilities
const { testDBError, authenticate } = require("./utilities.js")

// Setup: Authenticate an admin user and store the session via the agent
beforeAll(async () => {
    agent = request.agent(app) 
    await agent.post('/login').send({
        username: 'admin',
        password: process.env.ADMIN_PASSWORD
    }) 
}) 

// Teardown: Destroy the active session and close the database connection
afterAll(async () => {
    await agent.delete("/session")
    await pool.end() 
})

// Test suite for retrieving option categories associated with a specific product ID
describe("Get /categories/:id", () => {
    testDBError('SELECT * FROM option_categories WHERE product_id = $1 ORDER BY rank', () => agent.get(`/categories/${getId}`))
    
    it("Gets Saffron pistachio options categories", async () => {
        const response = await agent.get(`/categories/${getId}`)
        expect(response.statusCode).toBe(200)

    })
    
    it("returns 404 as no product found", async () => {
        const response = await agent.get(`/categories/${fakeId}`)
        expect(response.statusCode).toBe(404)
    })
})

// Test suite for creating new option categories for a product
describe("Post /categories Create new option category", () => {
    const query = 'INSERT INTO option_categories (multiple, description, rank, required, product_id) VALUES ($1, $2, $3, $4, $5) RETURNING id'
    
    // Verify route is protected by authentication
    authenticate(() => request(app).post('/categories').send({
        "multiple": true, "description": "test", "product_id": 56, "rank": 5
    }))

    // Verify database error handling
    testDBError(query, () => agent.post('/categories').send({
        "multiple": true, "description": "test", "product_id": 56, "rank": 5
    }))

    it("Returns 201 when new category added with multiple", async () => {
        const response = await agent.post('/categories').send({
            "multiple": true, "description": "test", "product_id": 56, "rank": 5
        })
        expect(response.statusCode).toBe(201)
        // Track the first created category ID for later cleanup
        id = response.body.id
    })
    
    it("Returns 201 when new category added", async () => {
        const response = await agent.post('/categories').send({
            "required": true, "description": "test", "product_id": 56, "rank": 5
        })
        expect(response.statusCode).toBe(201)
        // Track the second created category ID for later cleanup
        id2 = response.body.id
    })
    
    // Verify mutually exclusive validation logic for 'required' and 'multiple' flags
    it("Returns 500 when new category added with both required and multiple true", async () => {
        const response = await agent.post('/categories').send({
            "required": true, "multiple": true, "description": "test", "product_id": 56, "rank": 5
        })
        expect(response.statusCode).toBe(500)
    })
    
    it("Returns 500 when new category added with both required and multiple false", async () => {
        const response = await agent.post('/categories').send({
            "required": false, "multiple": false, "description": "test", "product_id": 56, "rank": 5
        })
        expect(response.statusCode).toBe(500)
    })

})

// Test suite for updating existing option category details
describe("Put /options/:id Edit option", () => {
    const query = `UPDATE option_categories SET multiple = COALESCE($1, multiple), 
        description = COALESCE($2, description) WHERE id = $3 `
        
    // Verify route is protected by authentication
    authenticate(() => request(app).put(`/categories/${id}`).send({
        "rank": 6
    }))

    // Verify database error handling
    testDBError(query, () => agent.put(`/categories/${id}`).send({
        "rank": 6
    }))

    it("Returns 200 when rank changed", async () => {
        const response = await agent.put(`/categories/${id}`).send({
            "rank": 6
        })
        expect(response.statusCode).toBe(200)

    })

    it("Returns 404 when category cannot be found", async () => {
        const response = await agent.put(`/categories/${fakeId}`).send({
            "rank": 6
        })
        expect(response.statusCode).toBe(404)


    })
})

// Test suite for deleting an option category
describe("Delete /categories/:id delete category ", () => {
    // Verify route is protected by authentication
    authenticate(() => request(app).delete(`/categories/${id}`))
    
    // Verify database error handling
    testDBError('DELETE FROM option_categories WHERE id = $1', () => agent.delete(`/categories/${id}`))
    
    // Clean up the dynamically created categories from the POST tests
    it("Returns 200 when option deleted", async () => {
        const response = await agent.delete(`/categories/${id}`)
        expect(response.statusCode).toBe(200)

    })
    
    it("Returns 200 when option deleted 2", async () => {
        const response = await agent.delete(`/categories/${id2}`)
        expect(response.statusCode).toBe(200)

    })
    
    it("Returns 404 when option doesnt exist", async () => {
        const response = await agent.delete(`/categories/${fakeId}`)
        expect(response.statusCode).toBe(404)

    })
})