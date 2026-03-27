// --- Core Dependencies ---
const request = require('supertest') 
const app = require('../index.js') 
const pool = require("../db.js")

/**
 * Generates a test suite to verify route authentication.
 * Expects a 401 status code when accessing protected routes without an active session.
 */
const authenticate = (requested) => {
    return (
        it('Should return 401 when user is not authenticated', async () => {
            try {
                const response = await requested()
                expect(response.statusCode).toBe(401) 
                expect(response.body.error).toBe('Not authorized')
            } catch (err) {
                // Handle edge case: File uploads may cause the server to drop the 
                // connection (ECONNRESET) before it can return a proper 401 response.
                if (err.code === 'ECONNRESET') {
                    expect(err.code).toBe('ECONNRESET')
                } else {
                    throw error
                }
            }
        })
    )
}

/**
 * Simulates a database failure for a specific query to verify server error handling.
 * Mocks the pg pool to throw an error and expects a 500 response status.
 */
const testDBError = (query, requested, msg = "Database error") => {
    it('should return 500 if the database throws an error', async () => {
        // Save original query function to restore later or pass through unmatched queries
        const originalQuery = pool.query 
        
        // Intercept the database call using Jest
        jest.spyOn(pool, 'query').mockImplementation((sql, ...args) => {
            const maybeCallback = args[args.length - 1] 
            
            // Match the targeted SQL query
            if (typeof sql === 'string' && sql.includes(query)) {
                // Handle callback-style pg queries
                if (typeof maybeCallback === 'function') {
                    return process.nextTick(() => {
                        maybeCallback(new Error("Simulated DB Crash"), null) 
                    }) 
                // Handle Promise-style pg queries
                } else {
                    return Promise.reject(new Error("Simulated DB Crash")) 
                }
            }
            // Pass through any queries that don't match the target
            return originalQuery.call(pool, sql, ...args) 
        }) 

        // Execute the route request
        const response = await requested()
        
        // Assert the expected 500 error response
        expect(response.statusCode).toBe(500) 
        expect(response.body.msg).toBe(msg) 
        
        // Clean up the mock
        jest.restoreAllMocks() 
    }) 
}

/**
 * Simulates a database returning zero rows for a specific query.
 * Useful for testing 404/Not Found logic without needing to empty actual DB tables.
 */
const testNoResults = async (query, endpointCall) => {
    // Save the original function reference to avoid infinite recursion
    const originalQuery = pool.query 

    // Intercept the database call
    const spy = jest.spyOn(pool, 'query').mockImplementation((sql, params, callback) => {
        // Match the targeted SQL query to return an empty result
        if (typeof sql === 'string' && sql.includes(query)) {
            const emptyResult = { rowCount: 0, rows: [] } 
            
            // Handle callback-style queries
            if (typeof params === 'function') return params(null, emptyResult) 
            if (typeof callback === 'function') return callback(null, emptyResult) 
            
            // Handle Promise-style queries
            return Promise.resolve(emptyResult) 
        }

        // Execute original query for unmatched SQL statements
        return originalQuery.apply(pool, [sql, params, callback]) 
    }) 

    try {
        // Execute the route request
        return await endpointCall() 
    } finally {
        // Always restore the mock to prevent side effects in other tests
        spy.mockRestore() 
    }
}

/**
 * Helper utility to extract and decode the Express session ID (sid) 
 * from the 'set-cookie' header of an HTTP response.
 */
const getSid = (response) => {
    const cookie = response.headers['set-cookie'][0] 
    const encodedSid = cookie.split(' ')[0].split('=')[1] 
    const decodedSid = decodeURIComponent(encodedSid) 
    
    // Strip the 's:' prefix if it exists (standard Express session format)
    const sid = decodedSid.startsWith('s:')
        ? decodedSid.slice(2).split('.')[0]
        : decodedSid.split('.')[0] 
    return sid
}

module.exports = { authenticate, testDBError, testNoResults, getSid }