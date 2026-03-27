const request = require('supertest') 
const app = require('../index') 

// TODO: Written by AI - must replace with better code. 
// (The comments below document the current mocking strategy to aid in future refactoring)

// --- 1. Mock External Stripe API ---
// We mock the entire Stripe library to prevent real network calls and charges during testing.
jest.mock('stripe', () => {
    const stripeMock = {
        checkout: {
            sessions: {
                create: jest.fn(),
                retrieve: jest.fn()
            }
        },
        webhooks: {
            constructEvent: jest.fn()
        }
    } 
    return jest.fn(() => stripeMock) 
}) 

// --- 2. Mock Internal Cart Routes ---
// We mock the `addCartToOrder` function to decouple the Stripe tests from the database/cart logic.
// `requireActual` is used to preserve the rest of the cart exports so Express doesn't crash on boot.
jest.mock('../routes/carts', () => {
    const original = jest.requireActual('../routes/carts') 
    return {
        ...original,
        addCartToOrder: jest.fn()
    } 
}) 

// --- 3. Mock Internal Stripe Routes ---
// Preserving exports for the stripe router so we can test individual functions like `fulfillCheckout` directly.
jest.mock('../routes/stripe', () => {
    const original = jest.requireActual('../routes/stripe') 
    return {
        ...original,
        // If fulfillCheckout is exported, we keep it as is or mock it if needed
    } 
}) 

const { fulfillCheckout } = require('../routes/stripe') 
const cartRoute = require('../routes/carts') 
const stripe = require('stripe')() 

// ... rest of your tests ...

describe('Stripe API', () => {
    
    // Teardown: Clear all mock usage data (call counts, returned values) between tests
    // to prevent state bleed-over that could cause false positives/negatives.
    beforeEach(() => {
        jest.clearAllMocks() 
    }) 

    // Test suite for generating a Stripe Checkout Session ID for the frontend
    describe('POST /create-checkout-session', () => {
        it('should return a clientSecret for valid cart', async () => {
            // Arrange: Force the Stripe mock to return a fake client secret
            stripe.checkout.sessions.create.mockResolvedValue({ client_secret: 'test_secret_123' }) 

            const cart = [
                {
                    name: 'Test Cake',
                    price: 10.5,
                    quantity: 1,
                    img: 'https://example.com/image.jpg',
                    optionsFlat: ['Option1', 'Option2'],
                    extra: 'No nuts',
                },
            ] 
            
            // Act: Fire the checkout creation route
            const res = await request(app)
                .post('/create-checkout-session')
                .send({ cart, address_id: 1 }) 
            
            // Assert: Verify the route parses the mock and returns the secret to the client
            expect(res.statusCode).toBe(200) 
            expect(res.body).toHaveProperty('clientSecret', 'test_secret_123') 
        }) 
        
        it('should successfully create a session when cart item "extra" is null', async () => {
            // Arrange: Force the Stripe mock to return a fake client secret
            stripe.checkout.sessions.create.mockResolvedValue({ client_secret: 'test_secret_null_extra' }) 

            const cart = [
                {
                    name: 'Test Cake No Notes',
                    price: 12.0,
                    quantity: 1,
                    img: 'https://example.com/image_no_extra.jpg',
                    optionsFlat: ['Standard'],
                    extra: null, // <-- This explicitly tests the fallback/null-handling logic in the route
                },
            ] 
            
            // Act
            const res = await request(app)
                .post('/create-checkout-session')
                .send({ cart, address_id: 2 }) 
            
            // Assert
            expect(res.statusCode).toBe(200) 
            expect(res.body).toHaveProperty('clientSecret', 'test_secret_null_extra') 
        }) 
        
    }) 

    // Test suite verifying frontend payment status requests against Stripe's backend
    // --- COVERS LINES 119-122 (verifyPayment branches) ---
    describe('POST /verify-pay', () => {
        it('should return 400 for invalid sessionId (Stripe error)', async () => {
            // Arrange: Simulate Stripe throwing an error when looking up a fake session
            stripe.checkout.sessions.retrieve.mockRejectedValue(new Error('No such checkout.session')) 
            
            // Act
            const res = await request(app)
                .post('/verify-pay')
                .send({ sessionId: 'invalid_session_id' }) 
            
            // Assert
            expect(res.statusCode).toBe(400) 
            expect(res.body).toHaveProperty('msg', 'Invalid session ID or session not found') 
        }) 

        it('should return 200 Paid if payment_status is paid', async () => {
            // Arrange: Simulate a successful, finalized Stripe payment
            stripe.checkout.sessions.retrieve.mockResolvedValue({ payment_status: 'paid' }) 
            
            // Act
            const res = await request(app)
                .post('/verify-pay')
                .send({ sessionId: 'valid_session_id' }) 
            
            // Assert
            expect(res.statusCode).toBe(200) 
            expect(res.body).toHaveProperty('msg', 'Paid') 
        }) 

        it('should return 400 Not paid if payment_status is unpaid', async () => {
            // Arrange: Simulate an abandoned or failed Stripe payment
            stripe.checkout.sessions.retrieve.mockResolvedValue({ payment_status: 'unpaid' }) 
            
            // Act
            const res = await request(app)
                .post('/verify-pay')
                .send({ sessionId: 'valid_session_id' }) 
            
            // Assert
            expect(res.statusCode).toBe(400) 
            expect(res.body).toHaveProperty('msg', 'Not paid') 
        }) 
    }) 

    // Unit test suite for the internal function that converts a paid cart into an order
    // --- COVERS LINES 64-84 (fulfillCheckout function) ---
    describe('fulfillCheckout', () => {
        it('should call addCartToOrder when payment_status is paid', async () => {
            // Arrange: Provide required Stripe metadata (session ID, address ID)
            stripe.checkout.sessions.retrieve.mockResolvedValue({
                payment_status: 'paid',
                metadata: { sid: 'session123', address_id: 'address123' }
            }) 
            // Mock a successful cart-to-order database operation
            cartRoute.addCartToOrder.mockResolvedValue(true) 

            // Act: Call the internal function directly
            await fulfillCheckout('cs_test_123') 

            // Assert: Verify data is passed down the chain correctly
            expect(stripe.checkout.sessions.retrieve).toHaveBeenCalledWith('cs_test_123', { expand: ['line_items'] }) 
            expect(cartRoute.addCartToOrder).toHaveBeenCalledWith('session123', 'address123', 'cs_test_123') 
        }) 

        it('should handle errors in the catch block if addCartToOrder fails', async () => {
            // Arrange
            stripe.checkout.sessions.retrieve.mockResolvedValue({
                payment_status: 'paid',
                metadata: { sid: 'session123', address_id: 'address123' }
            }) 
            
            // Force an error to hit the internal `catch (e)` block
            cartRoute.addCartToOrder.mockRejectedValue(new Error('Database Connection Error')) 

            // Assert: The function should gracefully catch the error internally, rather than throwing it to the server
            await expect(fulfillCheckout('cs_test_123')).resolves.not.toThrow() 
        }) 

        it('should do nothing if payment_status is not paid', async () => {
            // Arrange
            stripe.checkout.sessions.retrieve.mockResolvedValue({ payment_status: 'unpaid' }) 
            
            // Act
            await fulfillCheckout('cs_test_123') 
            
            // Assert: Ensures the code bypassed the internal logic if the payment wasn't finalized
            expect(cartRoute.addCartToOrder).not.toHaveBeenCalled() 
        }) 
    }) 

    // Test suite for the Stripe Webhook receiver (handles async payment confirmations from Stripe)
    // --- COVERS LINES 90-107 (webhook event processing) ---
    describe('POST /webhook', () => {
        it('should return 400 if webhook signature is missing or invalid', async () => {
            // Arrange: Force the Stripe validation function to fail (simulating a spoofed webhook)
            stripe.webhooks.constructEvent.mockImplementation(() => {
                throw new Error('Invalid signature') 
            }) 

            // Act
            const res = await request(app)
                .post('/webhook')
                .set('stripe-signature', 'bad_signature')
                .send({ test: 'data' }) 

            // Assert
            expect(res.statusCode).toBe(400) 
            expect(res.body.msg).toContain('Webhook Error: Invalid signature') 
        }) 

        it('should return 200 and process checkout.session.completed event', async () => {
            // Arrange: Mock the webhook event construction to bypass signature validation
            stripe.webhooks.constructEvent.mockReturnValue({
                type: 'checkout.session.completed',
                data: { object: { id: 'cs_test_123' } }
            }) 
            
            // Mock the fulfillCheckout retrieval that happens immediately after validation
            stripe.checkout.sessions.retrieve.mockResolvedValue({
                payment_status: 'paid',
                metadata: { sid: 'session123', address_id: 'address123' }
            }) 

            // Act
            const res = await request(app)
                .post('/webhook')
                .set('stripe-signature', 'good_signature')
                .send({ test: 'data' }) 

            // Assert
            expect(res.statusCode).toBe(200) 
            expect(res.body).toHaveProperty('received', true) 
        }) 
        
        it('should return 200 and ignore events that are not checkout.session.completed', async () => {
            // Arrange: Mock the webhook returning an irrelevant event type (e.g., payment intent created)
            stripe.webhooks.constructEvent.mockReturnValue({
                type: 'payment_intent.succeeded', // <-- This forces the internal IF block to evaluate to false
                data: { object: { id: 'pi_test_123' } }
            }) 

            // Act
            const res = await request(app)
                .post('/webhook')
                .set('stripe-signature', 'valid_signature')
                .send({ test: 'irrelevant_data' }) 

            // Assert: It should still return a 200 { received: true } to tell Stripe to stop sending the event
            expect(res.statusCode).toBe(200) 
            expect(res.body).toHaveProperty('received', true) 
            
            // Ensure fulfillCheckout was NOT triggered (verified by checking if retrieve was called)
            expect(stripe.checkout.sessions.retrieve).not.toHaveBeenCalled() 
        }) 
    }) 
})