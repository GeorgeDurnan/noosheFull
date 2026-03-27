// --- Core Dependencies ---
const request = require('supertest')
const app = require('../index.js')
const pool = require("../db.js")
const cartRoute = require("../routes/carts.js")
const { randomUUID } = require('crypto') 
require('dotenv').config()

// --- Shared State & Mock Data ---
// Initialize session agent and variables to track order/cart states across tests
let agent
const getOrder = 23 // Target existing order ID
const fakeId = 0

const status = "pending"
const productId = 56
const optionTest = { "options": "test" }
// Existing Stripe payment intent ID for duplication testing
const realStripe = "cs_test_b1w96Iwi4pwoZb3lnqEEOFiXHzCJEo31upggyDDxckSgKNgvpwSGwzc5OK"

let sid
let orderId

// Import custom testing utilities
const { testDBError, authenticate, testNoResults, getSid } = require("./utilities.js")

// Setup: Authenticate an admin user and extract the session ID (sid)
beforeAll(async () => {
    agent = request.agent(app) 
    const response = await agent.post('/login').send({
        username: 'admin',
        password: process.env.ADMIN_PASSWORD
    }) 
    sid = getSid(response)
}) 

// Teardown: Clean up the active session and close the database pool
afterAll(async () => {
    await agent.delete("/session")
    await pool.end() 
})

// --- Test Suites ---

// Test suite for retrieving the list of all orders
describe("Get /orders", () => {
    const query = 'SELECT id, status, created_at, price FROM orders ORDER BY id ASC'
    const req = () => agent.get("/orders")
    
    // Verify route is protected and handles DB errors
    authenticate(() => request(app).get('/orders'))
    testDBError(query, req)
    
    it("returns 404 as no product found", async () => {
        const response = await testNoResults(query, req)
        expect(response.statusCode).toBe(404)
        expect(response.body.msg).toBe("No orders found")
    })
    
    it("Returns 200 and has carts", async () => {
        const response = await req()
        expect(response.statusCode).toBe(200)
        expect(response.body.length).toBeGreaterThan(0)
    })
})

// Test suite for retrieving a specific order by its ID
describe("Get /orders/:id", () => {
    const query = 'SELECT * FROM orders WHERE id = $1'
    const req = () => agent.get(`/orders/${getOrder}`)
    
    // Verify route is protected and handles DB errors
    authenticate(() => request(app).get(`/orders/${getOrder}`))
    testDBError(query, req)
    
    it("returns 404 as no order found", async () => {
        const response = await agent.get(`/orders/${fakeId}`)
        expect(response.statusCode).toBe(404)
        expect(response.body.msg).toBe("Order not found")
    })
    
    it("Returns 200 and is the right order", async () => {
        const response = await req()
        expect(response.statusCode).toBe(200)
        expect(response.body.id).toBe(getOrder)
    })
})

// Test suite for retrieving the individual items within a specific order
describe("Get /orders/items/:id", () => {
    const query = 'SELECT * FROM order_items WHERE order_id = $1'
    const req = () => agent.get(`/orders/items/${getOrder}`)
    
    // Verify route is protected and handles DB errors
    authenticate(() => request(app).get(`/orders/items/${getOrder}`))
    testDBError(query, req)
    
    it("Returns 404 as no order exists", async () => {
        const response = await agent.get(`/orders/items/${fakeId}`)
        expect(response.statusCode).toBe(404)
    })
    
    it("Returns 200 and order items", async () => {
        const response = await req()
        expect(response.statusCode).toBe(200)
        expect(response.body.items.length).toBeGreaterThan(0)
    })
})

// Test suite for filtering orders by their current status (e.g., pending, shipped)
describe("GET /orders/status/:status", () => {
    const query = 'SELECT * FROM orders WHERE status = $1'
    const req = () => agent.get(`/orders/status/${status}`)
    
    // Verify route is protected and handles DB errors
    authenticate(() => request(app).get(`/orders/status/${status}`))
    testDBError(query, req)
    
    it("Get pending orders", async () => {
        const response = await req()
        expect(response.statusCode).toBe(200)
        expect(response.body.length).toBeGreaterThan(0)
    })
    
    it("returns 404 as no product with status found", async () => {
        const response = await agent.get(`/orders/status/badStatus`)
        expect(response.statusCode).toBe(404)
        expect(response.body.msg).toBe("no orders with status badStatus found")
    })
})

// Integration test suite for the complex logic of moving a cart to a finalized order
describe("Convert cart to order", () => {
    let myCart
    let fakeStripe
    
    // Ensure a fresh cart context and unique Stripe intent for every sub-test
    beforeEach(async () => {
        const response = await agent.get("/carts/items")
        myCart = await cartRoute.getCartFromSid(sid)
        fakeStripe = randomUUID()
    })
    
    // Always clean up the test cart regardless of test outcome
    afterEach(async () => {
        const response = await agent.delete(`/carts/${myCart}`)
        expect(response.statusCode).toBe(200)
    })
    
    // Direct unit test of the internal addCartToOrder function simulating a DB failure
    it('should return 500 if the database throws an error', async () => {
        const id = randomUUID()
        const requested = () => cartRoute.addCartToOrder(sid, 25, fakeStripe)
        const query = 'SELECT SUM(price * quantity) AS total FROM order_items WHERE order_id = $1'
        
        // Populate cart
        const addItemResponse = await agent.post("/carts/addItem").send({ "product_id": productId, "quantity": 2, "options": optionTest, "id": id, "extra": "" })
        expect(addItemResponse.statusCode).toBe(201)

        // Intercept specific total calculation query
        const originalQuery = pool.query 
        jest.spyOn(pool, 'query').mockImplementation((sql, ...args) => {
            const maybeCallback = args[args.length - 1] 
            if (typeof sql === 'string' && sql.includes(query)) {
                if (typeof maybeCallback === 'function') {
                    // Callback style error injection
                    return process.nextTick(() => {
                        maybeCallback(new Error("Simulated DB Crash"), null) 
                    }) 
                } else {
                    // Promise style error injection
                    return Promise.reject(new Error("Simulated DB Crash")) 
                }
            }
            return originalQuery.call(pool, sql, ...args) 
        }) 

        // Execute function and verify graceful failure
        const response = await requested()
        expect(response.msg).toBe("Failed") 
        jest.restoreAllMocks() 
    }) 
    
    // Happy path: Cart successfully becomes an order
    it("Converts and cart is considered converted", async () => {
        const id = randomUUID()

        const addItemResponse = await agent.post("/carts/addItem").send({ "product_id": productId, "quantity": 2, "options": optionTest, "id": id, "extra": "" })
        expect(addItemResponse.statusCode).toBe(201)

        const convertCartResponse = await cartRoute.addCartToOrder(sid, 25, fakeStripe)
        // Store the newly created orderId for the final DELETE test block
        orderId = convertCartResponse.order_id
        expect(typeof convertCartResponse).toBe("object")

        // Verify the original cart's status was correctly updated
        const getCartResponse = await agent.get(`/carts/items/${myCart}`)
        expect(getCartResponse.body.data[0].status).toBe("converted")
    })
    
    // Edge case: Empty cart block
    it("Does not convert as there are no items in cart", async () => {
        const convertCartResponse = await cartRoute.addCartToOrder(sid, 25, fakeStripe)
        expect(convertCartResponse).toBe("No items")
        const getCartResponse = await agent.get(`/carts/items/${myCart}`)
        expect(getCartResponse.body.data[0].status).toBe("active")
    })
    
    // Edge case: Idempotency check (preventing double charging/processing)
    it("Does not convert as there is already a order with that stripe", async () => {
        const id = randomUUID()

        const addItemResponse = await agent.post("/carts/addItem").send({ "product_id": productId, "quantity": 2, "options": optionTest, "id": id, "extra": "" })
        expect(addItemResponse.statusCode).toBe(201)

        const convertCartResponse = await cartRoute.addCartToOrder(sid, 25, realStripe)
        expect(convertCartResponse).toBe("Stripe already exists")
        const getCartResponse = await agent.get(`/carts/items/${myCart}`)
        expect(getCartResponse.body.data[0].status).toBe("active")
    })
})

// Test suite for deleting an order (cleans up the order created in the convert test)
describe("DELETE /orders/:id", () => {
    const query = 'DELETE FROM orders WHERE id = $1'
    const req = () => agent.delete(`/orders/${orderId}`)
    
    // Note: The authenticate test points to a GET route here based on the original code
    authenticate(() => request(app).get(`/orders/status/${status}`))
    testDBError(query, req)
    
    it("returns 200 when deleted", async () => {
        const response = await req()
        expect(response.statusCode).toBe(200)
    })
    
    it("returns 404 when no order to be deleted", async () => {
        const response = await agent.delete(`/orders/${fakeId}`)
        expect(response.statusCode).toBe(404)
        expect(response.body.msg).toBe(`Order with ID: ${fakeId} not found`)
    })
})