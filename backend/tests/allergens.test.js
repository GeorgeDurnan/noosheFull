const request = require('supertest');
const app = require('../index.js');
const pool = require("../db.js");
require('dotenv').config();

let agent;
const fakeId = 0;        // Guaranteed to not exist; used for 404 tests
const productId = 56;    // Pre-seeded product ID (Saffron pistachio cheesecake)
const { testDBError, authenticate, testNoResults } = require("./utilities.js");

beforeAll(async () => {
    // Use an agent to persist the auth session/cookie across all tests
    agent = request.agent(app);

    await agent.post('/login').send({
        username: 'admin',
        password: process.env.ADMIN_PASSWORD
    });
});

afterAll(async () => {
    // Teardown: clear session and close DB pool to prevent open handles
    await agent.delete("/session");
    await pool.end();
});

describe("GET /allergens", () => {
    const query = 'SELECT * FROM allergens';
    const req = () => agent.get('/allergens');
    
    testDBError(query, req);
    
    it("Returns products", async () => {
        const response = await req();
        expect(response.statusCode).toBe(200);
        // Ensure the database returns seeded allergen records
        expect(response.body.length).toBeGreaterThan(0);
    });
    
    it("Returns 404 as no allergens found", async () => {
        const response = await testNoResults(query, req);
        expect(response.statusCode).toBe(404);
    });
});

describe("GET /allergens/:id", () => {
    const query = 'SELECT * FROM allergens WHERE product_id = $1';
    const req = () => agent.get(`/allergens/${productId}`);
    
    testDBError(query, req);
    
    it("Gets Saffron pistachio allergens back", async () => {
        const response = await req();
        expect(response.statusCode).toBe(200);
        // Verify specific data mapped to the seeded productId
        expect(response.body[0].lactose).toBe(true);
    });
    
    it("returns 404 as no product found", async () => {
        const response = await agent.get(`/allergens/${fakeId}`);
        expect(response.statusCode).toBe(404);
    });
});

describe("POST /allergens - Create new allergen list", () => {
    let productId;
    let test = false; // Tracks if an allergen needs to be deleted
    const query = 'INSERT INTO allergens (product_id, celery, gluten, crustaceans, eggs, fish, lupin, molluscs, mustard, tree_nuts, peanuts, sesame, soya, sulphides, lactose) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)';
    
    // Helper to dynamically generate a POST request for a specific allergen
    function returnReq(allergen) {
        return (() => agent.post("/allergens").send({ "product_id": productId, [allergen]: true }));
    }
    
    beforeEach(async () => {
        // Seed a temporary product required to satisfy the foreign key constraint
        const response = await agent.post('/products').send({
            "name": "Carrot Cake Test", "price": 90.00, "description": "Carroty cake", "category_id": 2
        });
        productId = response.body.id;
        expect(response.statusCode).toBe(201);
    });
    
    afterEach(async () => {
        // Only attempt to delete the allergen if the test successfully created it
        if (test) {
            const delAlRep = await agent.delete(`/allergens/${productId}`);
            expect(delAlRep.statusCode).toBe(200);
            test = false;
        }
        
        // Cleanup the temporary product
        const delProRep = await agent.delete(`/products/${productId}`);
        expect(delProRep.statusCode).toBe(200);
    });
    
    authenticate(() => request(app).post("/allergens").send({ "product_id": productId, "celery": true }));
    testDBError(query, returnReq("celery"));

    it("Returns 201 when new allergen list added without all but celery", async () => {
        const response = await returnReq("celery")();
        expect(response.statusCode).toBe(201);
        test = true;
    });
    
    it("Returns 201 when new allergen list added without all but gluten", async () => {
        const response = await returnReq("gluten")();
        expect(response.statusCode).toBe(201);
        test = true;
    });

    it("Returns 500 when new allergen list added without a real product id", async () => {
        const response = await agent.post("/allergens").send({ "product_id": fakeId, "celery": true });
        // Expected 500 due to foreign key violation on non-existent product
        expect(response.statusCode).toBe(500); 
    });
});

describe("PUT /allergens/:id - Edit allergies", () => {
    let productId;
    const query = `
        UPDATE allergens
        SET
            celery = COALESCE($1, celery),
            gluten = COALESCE($2, gluten),
            crustaceans = COALESCE($3, crustaceans),
            eggs = COALESCE($4, eggs),
            fish = COALESCE($5, fish),
            lupin = COALESCE($6, lupin),
            molluscs = COALESCE($7, molluscs),
            mustard = COALESCE($8, mustard),
            tree_nuts = COALESCE($9, tree_nuts),
            peanuts = COALESCE($10, peanuts),
            sesame = COALESCE($11, sesame),
            soya = COALESCE($12, soya),
            sulphides = COALESCE($13, sulphides),
            lactose = COALESCE($14, lactose)
        WHERE product_id = $15
        `;
        
    beforeEach(async () => {
        // Seed a temporary product and its associated initial allergens
        const addProductResponse = await agent.post('/products').send({
            "name": "Carrot Cake Test", "price": 90.00, "description": "Carroty cake", "category_id": 2
        });
        productId = addProductResponse.body.id;
        expect(addProductResponse.statusCode).toBe(201);

        const addAllResponse = await agent.post("/allergens").send({ "product_id": productId, "celery": true });
        expect(addAllResponse.statusCode).toBe(201);
    });
    
    afterEach(async () => {
        // Deleting the product triggers a cascading delete on the allergen record in the DB
        const delProRep = await agent.delete(`/products/${productId}`);
        expect(delProRep.statusCode).toBe(200);
    });

    const req = () => agent.put(`/allergens/${productId}`).send({ "mustard": true });
    authenticate(() => request(app).put(`/allergens/${productId}`).send({ "mustard": true }));

    testDBError(query, req);

    it("Returns 200 when name changed", async () => {
        const response = await req();
        expect(response.statusCode).toBe(200);
    });
    
    it("Returns 404 when name cannot be found", async () => {
        const response = await agent.put(`/allergens/${fakeId}`).send({ "mustard": true });
        expect(response.statusCode).toBe(404);
    });
});

describe("DELETE /allergens/:id - delete product", () => {
    // Note: Happy path (successful deletion) is inherently tested in the afterEach blocks above.
    const query = 'DELETE FROM allergens WHERE product_id = $1';
    const req = () => agent.delete(`/allergens/${fakeId}`);
    
    authenticate(() => request(app).delete(`/allergens/${fakeId}`));
    testDBError(query, req);
    
    it("Returns 404 when product doesnt exist", async () => {
        const response = await req();
        expect(response.statusCode).toBe(404);
    });
});