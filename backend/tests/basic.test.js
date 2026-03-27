// Mock payload representing a complex geocoding or map data object
const address = { "id": 146656, "label": "Manchester, United Kingdom", "details": { "osm_type": "R", "osm_id": 146656, "osm_key": "place", "osm_value": "city", "type": "city", "countrycode": "GB", "name": "Manchester", "county": "Greater Manchester", "state": "England", "country": "United Kingdom", "extent": [-2.3199185, 53.5445923, -2.1468288, 53.3401044] } }

const request = require('supertest');
const app = require('../index.js');
const pool = require("../db.js");
require('dotenv').config();

let agent;
const { testDBError } = require("./utilities.js");

beforeAll(async () => {
    // Instantiate an agent to maintain the session (cookies/tokens) across the test suite
    agent = request.agent(app);

    // Seed the active session by authenticating as an admin
    await agent.post('/login').send({
        username: 'admin',
        password: process.env.ADMIN_PASSWORD
    });
});

afterAll(async () => {
    // Teardown: terminate the session and close the database pool to prevent memory leaks/open handles
    //Also deletes the basic that was posted as it is tied to the SID
    await agent.delete("/session");
    await pool.end();
});

describe("POST /basic - Create new address", () => {
    // Ensures the application handles database insertion failures gracefully
    const query = 'INSERT INTO basic_address (address, sid) VALUES ($1, $2)'
    const req = () => agent.post('/basic').send({
        "address": address
    })
    testDBError(query, req);

    it("Returns 201 when basic address added", async () => {
        const response = await req()
        expect(response.statusCode).toBe(201);
    });
});

describe("GET /basic", () => {
    // Validates error handling for the select query tied to the current session ID (sid)
    const query = 'SELECT * FROM basic_address WHERE sid= $1'
    const req = () => agent.get('/basic')
    testDBError(query, req );

    it("Returns address", async () => {
        const response = await req()
        expect(response.statusCode).toBe(200);

        // Stringify both sides to deeply compare the nested JSON object structure reliably
        expect(JSON.stringify(response.body.address)).toBe(JSON.stringify(address));
    });

    it("Returns 404 as no sid has had an address added", async () => {
        // We intentionally use a raw `request(app)` instead of the `agent` here. 
        // This generates a brand-new request without the established session cookie, 
        // simulating a user/session that hasn't saved an address yet.
        const response = await request(app).get("/basic");
        expect(response.statusCode).toBe(404);
    });
});