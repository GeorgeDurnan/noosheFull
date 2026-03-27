// --- Core Dependencies ---
const request = require('supertest')
const app = require('../index.js')
const pool = require("../db.js")
require('dotenv').config()

// --- Shared State & Mock Data ---
// Initialize session agent and track dynamically created option IDs
let agent
let id
let id2
const getId = 56 // Target product ID for retrieval
const fakeId = 0

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

// Test suite for retrieving product options by product ID
describe("Get /options/:id", () => {
    const query = 'SELECT * FROM product_options WHERE product_id = $1 ORDER BY cat_id'
    const req = () => agent.get(`/options/${getId}`)
    
    // Verify database error handling
    testDBError(query, req)
    
    it("Gets Saffron pistachio options", async () => {
        const response = await req()
        expect(response.statusCode).toBe(200)
    })
    
    it("returns 404 as no product found", async () => {
        // Attempt retrieval for a non-existent product ID
        const response = await agent.get(`/options/${fakeId}`)
        expect(response.statusCode).toBe(404)
    })
})

// Test suite for creating new product options
describe("Post /options Create new option", () => {
    const query = 'INSERT INTO product_options (product_id, price, description, cat_id, rank) VALUES ($1, $2, $3, $4, $5) RETURNING id'
    const req = () => agent.post('/options').send({ "product_id": 56, "price": 30, "description": "Test", "cat_id": 26, "rank": 9 })
    
    // Verify route is protected by authentication
    authenticate(() => request(app).post('/options').send({
        "product_id": 56, "price": 30, "description": "Test", "cat_id": 26, "rank": 100
    }))
    
    // Verify database error handling
    testDBError(query, req)
    
    it("Returns 201 when new product added", async () => {
        const response = await req()
        expect(response.statusCode).toBe(201)
        // Store the newly created option ID for the PUT and DELETE tests
        id = response.body.id
    })
    
    it("Returns 201 when new product added without description", async () => {
        // Verify database handles optional fields correctly
        const response = await agent.post('/options').send({
            "product_id": 56, "price": 30, "cat_id": 26, "rank": 6
        })
        expect(response.statusCode).toBe(201)
        // Store the second created option ID for cleanup
        id2 = response.body.id
    })
})

// Test suite for updating an existing product option
describe("Put /options/:id Edit option", () => {
    const query = `UPDATE product_options SET price = COALESCE($1, price), 
        description = COALESCE($2, description), cat_id = COALESCE($3, cat_id) WHERE id = $4 `
    const req = () => agent.put(`/options/${id}`).send({ "price": 62.99 })
    
    // Verify route is protected by authentication
    authenticate(() => request(app).put(`/options/${id}`).send({
        "price": 10000
    }))
    
    // Verify database error handling
    testDBError(query, req)
    
    it("Returns 200 when name changed", async () => {
        const response = await req()
        expect(response.statusCode).toBe(200)
    })
    
    it("Returns 404 when name cannot be found", async () => {
        // Attempt an update on a non-existent option ID
        const response = await agent.put(`/options/${fakeId}`).send({
            "price": 62.99
        })
        expect(response.statusCode).toBe(404)
    })
})

// Test suite for deleting product options
describe("Delete /options/:id delete option ", () => {
    const query = 'DELETE FROM product_options WHERE id = $1'
    const req = () => agent.delete(`/options/${id}`)
    
    // Verify route is protected by authentication
    authenticate(() => request(app).delete(`/options/${id}`))
    
    // Verify database error handling
    testDBError(query, req)
    
    // Clean up the dynamically created options from the POST tests
    it("Returns 200 when option deleted", async () => {
        const response = await req()
        expect(response.statusCode).toBe(200)
    })
    
    it("Returns 200 when option deleted second", async () => {
        const response = await agent.delete(`/options/${id2}`)
        expect(response.statusCode).toBe(200)
    })
    
    it("Returns 404 when option doesnt exist", async () => {
        const response = await agent.delete(`/options/${fakeId}`)
        expect(response.statusCode).toBe(404)
    })
})