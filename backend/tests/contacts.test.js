// --- Core Dependencies ---
const request = require('supertest') 
const app = require('../index.js') 
const pool = require("../db.js")
require('dotenv').config()

// --- Shared State & Mock Data ---
// Initialize shared variables for session persistence and tracking created records
let agent
let id
const fakeId = 0

// Import custom test utilities
const { testDBError } = require("./utilities.js")

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

// Test suite for creating a new contact record
describe("Post /contacts Create new contact", () => {
    const query = 'INSERT INTO contacts (name, email) VALUES ($1, $2) RETURNING id'
    const req = () => agent.post('/contacts').send({
        "name": "Test", "email": "test@test.com"
    })
    
    // Validate database error handling for the insertion query
    testDBError(query, req)
    
    it("Returns 201 when basic address added", async () => {
        const response = await req()
        expect(response.statusCode).toBe(201)
        expect(typeof response.body.id).toBe("number")
        
        // Store the newly created contact ID for the subsequent deletion test
        id = response.body.id
    })
})

// Test suite for deleting a contact record
describe("DELETE /contacts/:id", () => {
    const query = 'DELETE FROM contacts WHERE id = $1'
    const req = () => agent.delete(`/contacts/${id}`)
    
    // Validate database error handling for the deletion query
    testDBError(query, req)
    
    it("Deletes address", async () => {
        const response = await req()
        expect(response.statusCode).toBe(200)
    })
    
    it("Returns 404 as no contact with that id", async () => {
        // Attempt to delete a non-existent ID
        const response = await agent.delete(`/contacts/${fakeId}`)
        expect(response.statusCode).toBe(404)
    })
})