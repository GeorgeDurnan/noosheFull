const request = require('supertest')
const app = require('../index.js')
const pool = require("../db.js")
require('dotenv').config()

// Initialize shared variables for state management across tests
let agent
let id
const fakeId = -1
const { testDBError, authenticate } = require("./utilities.js")

// Setup: Authenticate an admin session before running any tests
beforeAll(async () => {
    agent = request.agent(app)
    await agent.post('/login').send({
        username: 'admin',
        password: process.env.ADMIN_PASSWORD
    })
})

// Teardown: Destroy session and close database connection
afterAll(async () => {
    //Ensures db remains clean
    await agent.delete("/session")
    await pool.end()
})

// Test suite for retrieving product categories
describe("GET /cakeCats", () => {
    const query = 'SELECT * FROM product_categories ORDER BY rank'
    const req = () => agent.get('/cakeCats')
    
    // Validate database error handling
    testDBError(query, req)
    
    it("Returns categories", async () => {
        const response = await agent.get('/cakeCats')
        expect(response.statusCode).toBe(200)
        //Minimum number of cats
        expect(response.body.length).toBeGreaterThan(0)
    })
})

// Test suite for creating a new product category
describe("Post /cakeCats Create new category", () => {
    const query = 'INSERT INTO product_categories (description, rank) VALUES ($1, $2) RETURNING id'
    const req = () => agent.post('/cakeCats').send({
        "description": "TestCat", "rank": 10
    })
    
    // Ensure the route is protected by authentication middleware
    authenticate(() => request(app).post('/cakeCats').send({
        "description": "TestCat", "rank": 10
    }))
    
    // Validate database error handling
    testDBError(query, req)
    
    it("Returns 201 when new cat added", async () => {
        const response = await req()
        expect(response.statusCode).toBe(201)
        // Store the newly created category ID for subsequent PUT and DELETE tests
        id = response.body.id
    })
})

// Test suite for updating an existing product category
describe("Put /cakeCats/:id Edit cat ", () => {
    const query = `UPDATE product_categories SET description = COALESCE($1, description), "rank" = COALESCE($2, "rank")  WHERE id = $3 `
    const req = () => agent.put(`/cakeCats/${id}`).send({
        "description": "Test2", "rank": 100
    })
    
    // Ensure the route is protected by authentication middleware
    authenticate(() => request(app).put(`/cakeCats/${id}`).send({
        "description": "Test2", "rank": 100
    }))
    
    // Validate database error handling
    testDBError(query, req)
    
    it("Returns 200 when name changed", async () => {
        const response = await req()
        expect(response.statusCode).toBe(200)
    })
    
    it("Returns 404 when name cannot be found", async () => {
        // Attempt to update a non-existent ID
        const response = await agent.put(`/cakeCats/${fakeId}`).send({
            "description": "Test2", "rank": 100
        })
        expect(response.statusCode).toBe(404)
    })
})

// Test suite for deleting a product category
describe("Delete /cakeCats/:id delete cat", () => {
    const query = 'DELETE FROM product_categories WHERE id = $1'
    const req = () => agent.delete(`/cakeCats/${id}`)
    
    // Ensure the route is protected by authentication middleware
    authenticate(() => request(app).delete(`/cakeCats/${id}`))
    
    // Validate database error handling
    testDBError(query, req)
    
    it("Returns 200 when cat deleted", async () => {
        const response = await req()
        expect(response.statusCode).toBe(200)
    })
    
    it("Returns 404 when product doesnt exist", async () => {
        // Attempt to delete a non-existent ID
        const response = await agent.delete(`/cakeCats/${fakeId}`)
        expect(response.statusCode).toBe(404)
    })
})