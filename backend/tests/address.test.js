// --- Core Dependencies ---
const request = require('supertest') 
const app = require('../index.js') 
const pool = require("../db.js") 
require('dotenv').config() 

// --- Routing & Utilities ---
const cartRoute = require("../routes/carts.js") 
const { testDBError, authenticate, getSid } = require("./utilities.js") 

// --- Global Test Variables ---
let agent   
let id       // Stores the ID of the address created in the POST test to use in the DELETE test
let cartId   // Stores the user's cart ID
const fakeId = -1  // Used for 404 testing

beforeAll(async () => {
    // Create an agent to persist cookies/session across requests
    agent = request.agent(app) 
    
    // Authenticate as an admin user
    const response = await agent.post('/login').send({
        username: 'admin',
        password: process.env.ADMIN_PASSWORD
    }) 
    
    // Create cart and retrieves the cart ID of the cart from the session id 
    await agent.get('/carts/items') 
    const sid = getSid(response) 
    cartId = await cartRoute.getCartFromSid(sid) 
}) 

// --- Test Teardown ---
afterAll(async () => {
    //Deletes cart and session for a clean DB
    await agent.delete(`/carts/${cartId}`) 
    await agent.delete("/session") 
    
    // Close the database connection pool
    await pool.end() 
}) 


describe("Post /address - Create new address", () => {
    const query = 'INSERT INTO addresses (line_one, line_two, city, postcode) VALUES ($1, $2, $3, $4) RETURNING id'
    const req = () => agent.post('/address').send({
            "line_one": "Alabama", "city": "Manny", "postcode": "m154zd"
        })
        
    testDBError(query, req) 

    it("Returns 201 when a basic address is successfully added", async () => {
        // Act: Send valid address payload
        const response = await req() 
        
        // Assert: Check status code and save the generated ID for deletion tests
        expect(response.statusCode).toBe(201) 
        id = response.body.id  
    }) 

    it("Returns 401 when a user does not have a cart/active session", async () => {
        // Act: Use a fresh request(app) instead of the 'agent' to simulate an unauthenticated user
        const response = await request(app).post('/address').send({
            "line_one": "Alabama", "city": "Manny", "postcode": "m154zd"
        }) 
        
        // Assert
        expect(response.statusCode).toBe(401) 
    }) 
}) 
describe("Delete /address/:id", () => {
    const query = 'DELETE FROM addresses WHERE id = $1' 
    
    // Helper function to execute the delete request using the persisted agent
    const req = () => agent.delete(`/address/${id}`) 
    
    // Verify route is protected and handles DB failures
    authenticate(() => request(app).delete(`/address/${id}`)) 
    testDBError(query, req) 

    it("Returns 200 when the address is successfully deleted", async () => {
        // Act: Attempt to delete the address created in the POST block
        const response = await req() 
        
        // Assert
        expect(response.statusCode).toBe(200) 
    }) 

    it("Returns 404 when attempting to delete an address that doesn't exist", async () => {
        // Act: Use the predefined fakeId
        const response = await agent.delete(`/address/${fakeId}`) 
        
        // Assert
        expect(response.statusCode).toBe(404) 
        expect(response.body.msg).toBe(`Address with ID: ${fakeId} not found`) 
    }) 
}) 