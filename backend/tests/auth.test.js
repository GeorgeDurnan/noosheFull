// --- Core Dependencies ---
const request = require('supertest')
const app = require('../index.js')
const pool = require("../db.js")
const http = require('http')
require('dotenv').config()

const { authenticate, testDBError } = require('./utilities.js')

let agent

beforeAll(async () => {
  // Use a persistent agent to maintain session cookies across auth-protected routes
  agent = request.agent(app)
  await agent.post('/login').send({
    username: 'test',
    password: process.env.TEST_PASSWORD
  })
})

afterAll(async () => {
  // Teardown: terminate active session and close DB pool to prevent hanging processes
  await agent.delete("/session")
  await pool.end()
})

describe("POST /check", () => {
  const query = 'SELECT * FROM users WHERE username = $1'
  const req = () => agent.post('/check').send({ username: 'test', password: process.env.TEST_PASSWORD })
  
  // Verify route is protected and handles database connectivity issues
  authenticate(() => request(app)
    .post('/check')
    .send({
      username: 'admin',
      password: process.env.TEST_PASSWORD
    }))
  testDBError(query, req)

  it("Returns a 404 message if user doesn't exist", async () => {
    const response = await agent
      .post('/check')
      .send({
        username: 'testFalse',
        password: process.env.TEST_PASSWORD
      })
    expect(response.statusCode).toBe(404)
  })

  it("Returns false if password incorrect", async () => {
    const response = await agent
      .post('/check')
      .send({
        username: 'test',
        password: 'wrong'
      })
    expect(response.statusCode).toBe(401)
    expect(response.body.valid).toBe(false)
  })

  it("Returns true if password correct", async () => {
    const response = await req()
    expect(response.statusCode).toBe(200)
    expect(response.body.valid).toBe(true)
  })
})

describe('POST /login', () => {
  const query = 'SELECT * FROM users'
  const req = () => agent
    .post('/login')
    .send({
      username: 'test',
      password: process.env.TEST_PASSWORD
    })

  testDBError(query, req)

  it('should return a 401 status as the username is wrong', async () => {
    const response = await agent
      .post('/login')
      .send({
        username: 'test2',
        password: process.env.TEST_PASSWORD
      })
    expect(response.statusCode).toBe(401)
  })

  it('should return a 401 status as the password is wrong', async () => {
    const response = await agent
      .post('/login')
      .send({
        username: 'test',
        password: "wrong"
      })
    expect(response.statusCode).toBe(401)
  })

  it('should return a 200 status and the user name', async () => {
    const response = await req()
    expect(response.statusCode).toBe(200)
    expect(response.body.user.username).toBe('test')
  })

  it('should return 500 if request.logIn fails (Session/Serialize error)', async () => {
    // Manually mock the Passport.js logIn method on the http prototype to simulate internal failure
    const originalLogIn = http.IncomingMessage.prototype.logIn

    http.IncomingMessage.prototype.logIn = jest.fn(function (...args) {
      const callback = args[args.length - 1]
      if (typeof callback === 'function') {
        callback(new Error("Simulated request.logIn Error"))
      }
    })

    const response = await agent
      .post('/login')
      .send({
        username: 'test',
        password: process.env.TEST_PASSWORD
      })

    expect(response.statusCode).toBe(500)
    expect(response.body.msg).toBe("Database error")

    // Restore prototype method to prevent polluting subsequent tests
    if (originalLogIn) {
      http.IncomingMessage.prototype.logIn = originalLogIn
    } else {
      delete http.IncomingMessage.prototype.logIn
    }
  })
})

describe("/GET me", () => {
  // Verifies that the current session correctly identifies the logged-in user
  authenticate(() => request(app).get("/me"))
  it("Returns current user", async () => {
    const response = await agent.get("/me")
    expect(response.statusCode).toBe(200)
    expect(response.body.username).toBe('test')
  })
})

describe("/PUT change", () => {
  authenticate(() => request(app).put(`/change`).send({ username: "test", password: "test2" }))

  it("Cannot change password if user doesn't exist", async () => {
    const response = await agent.put(`/change`).send({ username: "testfalse", password: "test2" })
    expect(response.statusCode).toBe(403)
  })

  it("Cannot change password if not user", async () => {
    // Security check: prevents users from modifying credentials of other accounts (e.g., admin)
    const response = await agent.put(`/change`).send({ username: "admin", password: "test2" })
    expect(response.statusCode).toBe(403)
  })

  it("Changes the password", async () => {
    const response = await agent.put(`/change`).send({ username: "test", password: "test2" })
    expect(response.statusCode).toBe(200)
  })

  it("Changes it back", async () => {
    // Reverts password state to ensure environment remains consistent for other tests
    const response = await agent.put(`/change`).send({ username: "test", password: "test" })
    expect(response.statusCode).toBe(200)
  })
})

describe("POST /logout", () => {
  authenticate(() => request(app).post("/logout"));

  it('Returns 500 if Passport logout fails', async () => {
    // Mock both aliases (logout/logOut) to ensure the callback-based error is caught regardless of naming convention
    const originalLogout = http.IncomingMessage.prototype.logout;
    const originalLogOut = http.IncomingMessage.prototype.logOut;

    const mockError = cb => {
      if (typeof cb === 'function') cb(new Error("Simulated Logout Failure"));
    };

    http.IncomingMessage.prototype.logout = jest.fn(mockError);
    http.IncomingMessage.prototype.logOut = jest.fn(mockError);

    try {
      const response = await agent.post('/logout');
      expect(response.statusCode).toBe(500);
      expect(response.body.error).toBe("Simulated Logout Failure");
    } finally {
      // Finally block ensures cleanup runs even if expectations fail
      http.IncomingMessage.prototype.logout = originalLogout;
      http.IncomingMessage.prototype.logOut = originalLogOut;
    }
  });

  it("Logs out properly and terminates session", async () => {
    const response = await agent.post("/logout");
    expect(response.statusCode).toBe(200);
    expect(response.body.msg).toBe("Logged out");
  });
});