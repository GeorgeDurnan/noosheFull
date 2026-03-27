// --- Core Dependencies ---
const request = require('supertest') 
const app = require('../index.js')  
const pool = require("../db.js")
const { authenticate, testDBError } = require("./utilities.js")
require('dotenv').config()

// --- Shared State & Mock Data ---
// Initialize shared session agent for authenticated requests
let agent
// Array initialized for potential bulk user tracking (retained as per original code)
let userIds = []

// Setup: Authenticate an admin user and store the session via the persistent agent
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

// Test suite for retrieving the list of all users
describe("Get /users", () => {
    // Verify route is protected and handles database errors
    authenticate(() => request(app).get("/users"))
    testDBError('SELECT id, username FROM users ORDER BY id ASC', () => agent.get("/users")) 
    
    it('Retrieve users from DB', async () => {
        const response = await agent.get("/users")
        expect(response.statusCode).toBe(200)
        expect(response.body.length).toBeGreaterThan(0)
    })
})

// Test suite for retrieving a specific user by their ID
describe("Retrieve user by id", () => {
    // Verify route is protected and handles database errors
    authenticate(() => request(app).get("/users/33"))
    testDBError('SELECT * FROM users WHERE id = $1', () => agent.get("/users/33"))
    
    it('Retrieve admin user from DB', async () => {
        // Target an existing seeded user ID (admin)
        const response = await agent.get("/users/31")
        expect(response.statusCode).toBe(200)
        expect(response.body[0].username).toBe("admin")
    })
    
    it('Request user that doesnt exist', async () => {
        // Attempt to retrieve a non-existent user ID
        const response = await agent.get("/users/43")
        expect(response.statusCode).toBe(404)
    })
})

// Integration test suite for the full user creation and deletion lifecycle
describe('Creates user then deletes it', () => {
    // Generate a unique username to prevent collision constraints during tests
    const username = `test${Date.now()}`
    let id
    
    // Sub-suite: User Creation
    describe('Creates user', () => {
        // Verify route is protected and handles database errors
        authenticate(() => request(app).post('/signup')
            .send({
                username: username,
                password: 'test'
            }))
        testDBError('INSERT INTO users (username, hashed_password, salt) VALUES ($1, $2, $3) RETURNING id', () => agent
            .post('/signup')
            .send({
                username: username,
                password: 'test'
            }))
            
        it("Creates a new user", async () => {
            const response = await agent
                .post('/signup')
                .send({
                    username: username,
                    password: 'test'
                }) 
            expect(response.statusCode).toBe(201)
            expect(response.body.username).toBe(username)
            // Store the dynamically created user ID for the verification and deletion blocks
            id = response.body.id

        })
        
        it("It exists in the server", async () => {
            // Debugging log retained from original code
            ("->>>>>>>>>>2" + id)
            
            // Verify the newly created user can be fetched via the GET route
            const response = await agent
                .get(`/users/${id}`)
            expect(response.body.length).toBeGreaterThan(0)
            expect(response.status).toBe(200)
            expect(response.body[0].username).toBe(username)
        })
    })
    
    // Sub-suite: User Deletion (Cleanup)
    describe("Deletes user", () => {
        // Verify route is protected and handles database errors
        authenticate(() => request(app).delete(`/users/${id}`))
        testDBError('DELETE FROM users WHERE id = $1', () => agent.delete(`/users/${id}`))
        
        it("It deletes the user", async () => {
            const response = await agent.delete(`/users/${id}`)
            expect(response.statusCode).toBe(200)

        })
        
        it("It no longer exists in the server", async () => {
            // Verify the GET route returns a 404 after successful deletion
            const response = await agent
                .get(`/users/${id}`)
            expect(response.status).toBe(404)
        })
        
        it("It deletes a user that doesn't exist", async () => {
            // Attempt to delete a malformed or non-existent ID
            const response = await agent.delete(`/users/1}`)
            expect(response.statusCode).toBe(404)

        })
    })

})