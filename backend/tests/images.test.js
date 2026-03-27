const request = require('supertest') 
const app = require('../index.js') 
const pool = require("../db.js")
const cartRoute = require("../routes/carts.js")
require('dotenv').config()
let agent
let id
const productId = 56
const rank = 10
const fakeId = -1
const { testDBError, authenticate, testNoResults } = require("./utilities.js")
beforeAll(async () => {
    agent = request.agent(app) 
    await agent.post('/login').send({
        username: 'admin',
        password: process.env.ADMIN_PASSWORD
    }) 
}) 
afterAll(async () => {
    await agent.delete("/session")
    await pool.end() 
}) 
describe("Post /images", () => {
    const query = 'INSERT INTO images ("product_id", "url", "rank") VALUES ($1, $2, $3)'
    const req = () => agent
        .post('/images')
        .field('product_id', productId)
        .field('rank', rank)
        .attach('file', __dirname + '/../public/images/wildlife.jpg') 
    authenticate(() => request(app).post('/images')
        .field('product_id', productId)
        .field('rank', rank)
        .attach('file', __dirname + '/../public/images/wildlife.jpg'))
    testDBError(query, req)
    it("Returns 201 when image added", async () => {
        const response = await req()
        expect(response.statusCode).toBe(201)
        id = response.body.id
    })
})

describe("Delete /images/:id", () => {
    const query = 'DELETE FROM images WHERE product_id = $1 AND rank = $2'
    const req = () => agent.delete(`/images`).send({ "product_id": productId, "rank": rank })
    testDBError(query, req)
    it("Returns 200 when address deleted", async () => {
        const response = await req()
        expect(response.statusCode).toBe(200)

    })
    it("Returns 404 when image doesnt exist", async () => {
        const response = await agent.delete(`/images`).send({ "product_id": fakeId, "rank": rank })
        expect(response.statusCode).toBe(404)
        expect(response.body.msg).toBe(`Product image with rank: ${rank} not found`)

    })
})
describe("GET /cakes", () => {
    const query = 'SELECT * FROM images ORDER BY product_id'
    const req = () => agent.get('/cakes')
    testDBError(query, req)
    it("Returns images", async () => {
        const response = await req()
        expect(response.statusCode).toBe(200)
        expect(response.body.length).toBeGreaterThan(0)
    })
    it("Returns 404 as no images in DB", async () => {
        const response = await testNoResults(query, req)
        expect(response.statusCode).toBe(404)
    })

})
describe("GET /cakes/:id", () => {
    const query = 'SELECT * FROM images WHERE product_id = $1 ORDER BY rank'
    const req = () => agent.get(`/cakes/${productId}`)
    testDBError(query, req)
    it("Returns images", async () => {
        const response = await req()
        expect(response.statusCode).toBe(200)
        expect(response.body.length).toBeGreaterThan(0)
    })
    it("Returns 404 as no product", async () => {
        const response = await agent.get(`/cakes/${fakeId}`)
        expect(response.statusCode).toBe(404)
    })

})
describe('POST /images - Cloudinary upload error', () => {
    it('should return 500 if fetch throws', async () => {
        // Mock global.fetch to throw an error
        const originalFetch = global.fetch 
        global.fetch = jest.fn(() => { throw new Error('Simulated fetch failure')  }) 

        const response = await agent
            .post('/images')
            .field('product_id', 1)
            .field('rank', 1)
            .attach('file', __dirname + '/../public/images/wildlife.jpg')  //Test file

        expect(response.statusCode).toBe(500) 
        expect(response.body.msg).toBe('Database error') 
        expect(response.body.error).toBe('Simulated fetch failure') 

        // Restore original fetch
        global.fetch = originalFetch 
    }) 
}) 
