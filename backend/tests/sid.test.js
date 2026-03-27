// --- Core Dependencies ---
const request = require('supertest') 
const app = require('../index.js') 
const pool = require("../db.js")
require('dotenv').config()

// --- Shared State ---
// Initialize session agent for authenticated requests
let agent

// Import custom testing utilities
const { testDBError, authenticate, testNoResults } = require("./utilities.js")

// Setup: Authenticate an admin user and store the session via the agent
beforeAll(async () => {
    agent = request.agent(app) 
    const response = await agent.post('/login').send({
        username: 'admin',
        password: process.env.ADMIN_PASSWORD
    }) 
}) 

// Teardown: Clean up the active session and close the database connection
afterAll(async () => {
    await agent.delete("/session")
    await pool.end() 
}) 

// Test suite for the logout / session destruction endpoint
describe("Delete /session", () => {
    const query = 'DELETE FROM session WHERE sid = $1'
    const req = () => agent.delete(`/session`)
    
    // Verify the route is protected by authentication
    authenticate(() => request(app).delete(`/session`))
    
    // Verify database error handling during session deletion
    testDBError(query, req)
    
    // Note: The test description contains a copy-paste artifact ("allergens"), 
    // but the logic correctly tests the 404 Not Found fallback for an invalid/empty session deletion
    it("Returns 404 as no allergens found", async () => {
        const response = await testNoResults(query, req)
        expect(response.statusCode).toBe(404)
    })

})