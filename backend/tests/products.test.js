// --- Core Dependencies ---
const request = require('supertest')
const app = require('../index.js')
const pool = require("../db.js")
require('dotenv').config()

// --- Shared State & Mock Data ---
// Initialize session agent and track dynamically created product IDs
let agent
let id
const fakeId = 0

// Import custom testing utilities
const { testDBError, authenticate, testNoResults } = require("./utilities.js")

// Setup: Authenticate an admin user and store the session via the agent
beforeAll(async () => {
    agent = request.agent(app) 
    await agent.post('/login').send({
        username: 'admin',
        password: process.env.ADMIN_PASSWORD
    }) 
}) 

// Teardown: Clean up the active session and close the database connection
afterAll(async () => {
    await agent.delete("/session")
    await pool.end() 
})

// Test suite for retrieving the full catalog of products
describe("GET /products", () => {
    const query = 'SELECT * FROM products ORDER BY category_id'
    const req =  () => agent.get('/products')
    
    // Verify database error handling
    testDBError(query, req)
    
    it("Returns products", async () => {
        const response = await req()
        expect(response.statusCode).toBe(200)
        // Verify the database isn't completely empty
        expect(response.body.length).toBeGreaterThan(0)
    })
    
    it("Returns 404 when no products are found in the database", async () => {
        // Simulate an empty database table to verify 404 fallback logic
        const response = await testNoResults(query, req)
        expect(response.statusCode).toBe(404)
    })
})

// Test suite for retrieving a specific product by its ID
describe("Get /products/:id", () => {
    testDBError('SELECT * FROM products WHERE id = $1', () => agent.get('/products/56'))
    
    it("Gets Saffron pistachio back", async () => {
        // Target an existing product
        const response = await agent.get('/products/56')
        expect(response.statusCode).toBe(200)

    })
    
    it("returns 404 as no product found", async () => {
        const response = await agent.get(`/products/${fakeId}`)
        expect(response.statusCode).toBe(404)
    })
})

// Test suite for creating new products
describe("Post /products Create new product", () => {
    // Verify route is protected by authentication
    authenticate(() => request(app).post('/products').send({
        "name": "Carrot Cake Test", "price": 90.00, "description": "Carroty cake", "category_id": 1
    }))
    
    // Verify database error handling
    testDBError('INSERT INTO products (name, price, description, category_id) VALUES ($1, $2, $3, $4) RETURNING id', () => agent.post('/products').send({
        "name": "Carrot Cake Test", "price": 90.00, "description": "Carroty cake", "category_id": 1
    }))
    
    it("Returns 201 when new product added", async () => {
        const response = await agent.post('/products').send({
            "name": "Carrot Cake Test", "price": 90.00, "description": "Carroty cake", "category_id": 2
        })
        expect(response.statusCode).toBe(201)
        // Store the ID of the newly created product for later PUT and DELETE tests
        id = response.body.id
    })
    
    it("Returns 201 when new product added without description", async () => {
        // Verify database defaults/null handling for optional fields
        const response = await agent.post('/products').send({
            "name": "Test", "price": 90.00, "category_id": 2
        })
        expect(response.statusCode).toBe(201)
        
        // Immediately clean up this specific test product
        const id2 = response.body.id
        await agent.delete(`/products/${id2}`)
    })
})

// Test suite for updating an existing product's details
describe("Put /products/:id Edit product", () => {
    // Verify route is protected by authentication
    authenticate(() => request(app).put(`/products/${id}`).send({
        "name": "test"
    }))
    
    // Verify database error handling
    testDBError(`UPDATE products SET name = COALESCE($1, name),price = COALESCE($2, price), 
        description = COALESCE($3, description), category_id = COALESCE($4, category_id) WHERE id = $5 `
        , () => agent.put(`/products/${id}`).send({
            "name": "test"
        }))
        
    it("Returns 200 when name changed", async () => {
        const response = await agent.put(`/products/${id}`).send({
            "name": "test"
        })
        expect(response.statusCode).toBe(200)

    })
    
    it("Returns 404 when name cannot be found", async () => {
        const response = await agent.put(`/products/${fakeId}`).send({
            "name": "test"
        })
        expect(response.statusCode).toBe(404)

    })
})

// Test suite for deleting a product from the database
describe("Delete /products/:id delete product", () => {
    // Verify route is protected by authentication (Note: using .put here based on original code)
    authenticate(() => request(app).put(`/products/${id}`).send({
        "name": "test"
    }))
    
    // Verify database error handling
    testDBError('DELETE FROM products WHERE id = $1', () => agent.delete(`/products/${id}`))
    
    // Clean up the dynamically created product from the POST tests
    it("Returns 200 when product deleted", async () => {
        const response = await agent.delete(`/products/${id}`)
        expect(response.statusCode).toBe(200)

    })
    
    it("Returns 404 when product doesnt exist", async () => {
        const response = await agent.delete(`/products/${fakeId}`)
        expect(response.statusCode).toBe(404)

    })
})