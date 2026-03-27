// --- Core Dependencies ---
const request = require('supertest') 
const app = require('../index.js') 
const pool = require("../db.js")
require('dotenv').config()

// --- Shared State ---
// Initialize session agent for authenticated requests
let agent

// Setup: Authenticate an admin user and store the session via the agent
beforeAll(async () => {
    agent = request.agent(app) 
    await agent.post('/login').send({
        username: 'admin',
        password: process.env.ADMIN_PASSWORD
    }) 
}) 

// Teardown: Clean up the active session and close the database pool
afterAll(async () => {
    await agent.delete("/session")
    await pool.end() 
}) 

// --- CORS Middleware Tests ---

// Verify that the index router blocks cross-origin requests from unknown domains
it('should block requests from unauthorized origins', async () => {
    // Use a fresh request object instead of the authenticated agent to test pure CORS behavior
    const response = await request(app)
        .get('/users')
        .set('Origin', 'http://hacker-domain.com') 

    // Note: Express CORS middleware often returns a 500 or 
    // simply doesn't set the Access-Control-Allow-Origin header on failure.
    expect(response.headers['access-control-allow-origin']).toBeUndefined() 
}) 

// Verify that the index router permits requests from explicitly whitelisted domains
it('should allow requests from an allowed origin', async () => {
    // Use the authenticated agent since the /users endpoint likely requires it
    const response = await agent
        .get('/users')
        .set('Origin', process.env.NOOSHE)

    // Assert successful resolution and the presence of the correct CORS header
    expect(response.status).toBe(200)
    expect(response.headers['access-control-allow-origin']).toBe(process.env.NOOSHE)
})