// --- Core Dependencies ---
const request = require('supertest')
const app = require('../index.js')
const pool = require("../db.js")
const cartRoute = require("../routes/carts.js")
require('dotenv').config()

// --- Shared State & Mock Data ---
// Initialize session agent and track dynamically created wholesale contact IDs
let agent
let id
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

// Test suite for submitting a new wholesale/business inquiry
describe("Post /wholesale Create new business contact", () => {
    const query = 'INSERT INTO business_contact (name, contact_person, email, phone, address, textbox) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id'
    const req = () => agent.post('/wholesale').send({
        "name": "George", "contact_person": "test", "Email": "test@test.net", "phone": "0123456789", "address": "test address", "textbox": "test"
    })
    
    // Verify database error handling
    testDBError(query, req)
    
    it("Returns 201 when contact added", async () => {
        const response = await req()
        expect(response.statusCode).toBe(201)
        // Track the created contact ID for subsequent deletion testing
        id = response.body.id

    })
})

// Test suite for deleting a wholesale business contact record
describe("Delete /wholesale/:id", () => {
    const query = 'DELETE FROM business_contact WHERE id = $1'
    const req = () => agent.delete(`/wholesale/${id}`)
    
    // Verify the deletion route is securely protected by authentication
    authenticate(() => request(app).delete(`/wholesale/${id}`))
    
    // Verify database error handling
    testDBError(query, req)
    
    // Note: The test description says "address" instead of "contact", 
    // but the logic correctly tests the deletion of the wholesale record created above.
    it("Returns 200 when address deleted", async () => {
        const response = await req()
        expect(response.statusCode).toBe(200)

    })
    
    it("Returns 404 when address doesnt exist", async () => {
        // Attempt deletion of a non-existent ID
        const response = await agent.delete(`/wholesale/${fakeId}`)
        expect(response.statusCode).toBe(404)
        expect(response.body.msg).toBe(`Contact with ID: ${fakeId} not found`)

    })
})