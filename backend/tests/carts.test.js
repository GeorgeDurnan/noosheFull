// --- Core Dependencies ---
const request = require('supertest')
const app = require('../index.js')
const pool = require("../db.js")
const cartRoute = require("../routes/carts.js")
const { randomUUID } = require('crypto') 
require('dotenv').config()

// --- Shared State & Mock Data ---
let agent
let sid
// Store UUIDs to track and clean up dynamically generated cart items
let id
let id2
let id3
// Track dynamically created cart ID
let myCart

// Test data constants
const cartId = 71 // Pre-existing cart for specific ID tests
let productId = 56
const fakeId = 0
//Always lost as all carts could be lost and not pending if they expire
const status = "lost"
const optionTest = { "options": "test" }

// Custom testing utilities
const { testDBError, authenticate, testNoResults, getSid } = require("./utilities.js")

// Setup: Authenticate an admin user and extract the session ID (sid) for cart linking
beforeAll(async () => {
    agent = request.agent(app) 
    const response = await agent.post('/login').send({
        username: 'admin',
        password: process.env.ADMIN_PASSWORD
    }) 
    sid = getSid(response)
}) 

// Teardown: Destroy session and close the database connection
afterAll(async () => {
    await agent.delete("/session")
    await pool.end() 
})

// --- Test Suites ---

describe("Get /carts", () => {
    const query = 'SELECT * FROM carts ORDER BY id ASC'
    const req = () => agent.get("/carts")
    
    // Verify authentication and DB error handling
    authenticate(() => request(app).get('/carts'))
    testDBError(query, req)
    
    it("returns 404 as no product found", async () => {
        const response = await testNoResults(query, req)
        expect(response.statusCode).toBe(404)
        expect(response.body.msg).toBe("No carts found")
    })
    
    it("Returns 200 and has carts", async () => {
        const response = await req()
        expect(response.statusCode).toBe(200)
        expect(response.body.length).toBeGreaterThan(0)
    })
})

describe("Get /carts/items", () => {
    const query = 'SELECT product_id, quantity, options, id, extra FROM cart_items WHERE cart_id = $1'
    const req = () => agent.get("/carts/items")
    testDBError(query, req)
    
    it("Returns 404 and has cart as no items in there", async () => {
        const response = await req()
        expect(response.statusCode).toBe(404)
    })
    
    // Populate the cart so subsequent retrieval tests have data
    it("Returns 200 after item added", async () => {
        id = randomUUID()
        await agent.post("/carts/addItem").send({ "product_id": productId, "quantity": 2, "options": optionTest, "id": id, "extra": "" })
        const response = await req()
        expect(response.statusCode).toBe(200)
        // Store generated cart ID for later deletion tests
        myCart = response.body.cart_id
    })
    
    // Unit test for internal controller error handling
    describe('Get /carts/items Controller', () => {
        it('should return a 500 status if request.session.save throws an error', async () => {
            // Arrange: Setup mock error, request, and chainable response
            const mockSessionError = new Error('Simulated Redis/Memory store failure') 
            const mockRequest = {
                session: {
                    cartInitialized: false,
                    save: jest.fn((callback) => {
                        callback(mockSessionError) 
                    }),
                },
            } 
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } 

            // Act: Fire the controller directly
            await cartRoute.getCartItems(mockRequest, mockResponse) 

            // Assert: Verify standard error response payload
            expect(mockRequest.session.save).toHaveBeenCalled() 
            expect(mockResponse.status).toHaveBeenCalledWith(500) 
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Session save failed',
                details: mockSessionError,
            }) 
        }) 
    }) 
})

describe("Get /carts/items/:id", () => {
    const query = 'SELECT * FROM carts WHERE id = $1'
    const req = () => agent.get(`/carts/items/${cartId}`)
    
    // Note: Duplicate DB error test retained as per original code
    testDBError(query, req)
    testDBError(query, req)
    
    it("Get cart 71", async () => {
        const response = await req()
        expect(response.statusCode).toBe(200)
    })
    
    it("returns 404 as no product found", async () => {
        const response = await agent.get(`/carts/items/${fakeId}`)
        expect(response.statusCode).toBe(404)
    })
})

describe("GET /carts/status/:status", () => {
    const query = 'SELECT * FROM carts WHERE status = $1'
    const req = () => agent.get(`/carts/status/${status}`)
    testDBError(query, req)
    
    it("Get lost carts", async () => {
        const response = await req()
        expect(response.statusCode).toBe(200)
        expect(response.body.length).toBeGreaterThan(0)
    })
    
    it("returns 404 as no product found", async () => {
        const response = await agent.get(`/carts/status/badStatus`)
        expect(response.statusCode).toBe(404)
    })
})

describe("POST /carts/addItem", () => {
    id2 = randomUUID()
    const query = 'INSERT INTO cart_items (cart_id, product_id, quantity, options, id, extra) VALUES ($1, $2, $3, $4, $5, $6)'
    const req = () => agent.post("/carts/addItem").send({ "product_id": productId, "quantity": 2, "options": optionTest, "id": id2, "extra": "Test" })
    testDBError(query, req)

    it("Returns 201 when new product added", async () => {
        const response = await req()
        expect(response.statusCode).toBe(201)
    })
    
    // Verify optional 'extra' column handling
    it("Returns 201 when new product added without extra", async () => {
        id3 = randomUUID()
        const response = await agent.post("/carts/addItem").send({ "product_id": productId, "quantity": 2, "options": optionTest, "id": id3 })
        expect(response.statusCode).toBe(201)
    })
    
    // Use raw request (no agent) to test behavior without a session cookie
    it("Returns 404 if no sid provided", async () => {
        const response = await request(app).post("/carts/addItem").send({ "product_id": productId, "quantity": 2, "options": optionTest, "id": randomUUID() })
        expect(response.statusCode).toBe(404)
    })
})

describe("Put /carts", () => {
    const query = `UPDATE cart_items SET quantity = $1 WHERE cart_id = $2 AND product_id = $3 AND options::jsonb = $4::jsonb AND extra IS NOT DISTINCT FROM $5`
    const req = () => agent.put("/carts").send({ "product_id": productId, "quantity": 10, "options": optionTest, "extra": "Test" })
    testDBError(query, req)
    
    it("Returns 200 when name changed", async () => {
        const response = await req()
        expect(response.statusCode).toBe(200)
    })
    
    it("Returns 200 when name changed and extra is not included", async () => {
        const response = await agent.put("/carts").send({ "product_id": productId, "quantity": 10, "options": optionTest })
        expect(response.statusCode).toBe(200)
    })
    
    it("Returns 404 when name cannot be found", async () => {
        // Mismatched extra property
        const response = await agent.put("/carts").send({ "product_id": productId, "quantity": 10, "options": optionTest, "extra": "TestFake" })
        expect(response.statusCode).toBe(404)
    })
})

// Unit tests for the session-to-cart mapping utility
describe("Get cart from sid", () => {
    it("It return false with fake sid", async () => {
        const response = await cartRoute.getCartFromSid("fakeSid")
        expect(response).toBe(false)
    })
    
    it("It returns true with real sid", async () => {
        const response = await cartRoute.getCartFromSid(sid)
        // Should return the numeric ID of the cart attached to the active session
        expect(typeof (response)).toBe("number")
    })
})

// Helper to encapsulate delete payloads
function delReq(id) {
    return () => agent.delete(`/carts/items`).send({ "id": id })
}

describe("Delete /carts/items", () => {
    const query = 'DELETE FROM cart_items WHERE id = $1 AND cart_id = $2'
    testDBError(query, delReq(id))
    
    it('Should return 401 when user has no sid', async () => {
        // Unauthenticated request
        const response = await request(app).delete(`/carts/items`).send({ "id": id })
        expect(response.statusCode).toBe(401) 
        expect(response.body.error).toBe('Not authorized')
    })
    
    // Clean up the three items generated in the ADD test blocks
    it("Returns 200 when option deleted", async () => {
        const response = await delReq(id)()
        expect(response.statusCode).toBe(200)
    })
    
    it("Returns 200 when option deleted 2", async () => {
        const response = await delReq(id2)()
        expect(response.statusCode).toBe(200)
    })
    
    it("Returns 200 when option deleted 3", async () => {
        const response = await delReq(id3)()
        expect(response.statusCode).toBe(200)
    })

    it("Returns 404 when option doesnt exist", async () => {
        const response = await delReq(randomUUID())()
        expect(response.statusCode).toBe(404)
    })
})

describe("Delete /carts/:id", () => {
    const query = 'DELETE FROM carts WHERE id = $1'
    const req = () => agent.delete(`/carts/${myCart}`)
    
    // Ensure entire cart deletion is a protected route
    authenticate(() => request(app).delete(`/carts/${myCart}`))
    testDBError(query, req)
    
    it("Returns 200 when option deleted", async () => {
        const response = await req()
        expect(response.statusCode).toBe(200)
    })
    
    it("Returns 404 when option doesnt exist", async () => {
        const response = await agent.delete(`/carts/${fakeId}`)
        expect(response.statusCode).toBe(404)
    })
})