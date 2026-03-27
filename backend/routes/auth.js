const pool = require("../db")
var passport = require('passport')
var LocalStrategy = require('passport-local')
var crypto = require('crypto')

// STRATEGY: Local Username/Password
// Verifies credentials by matching the hashed input against the stored hash.
passport.use(new LocalStrategy(function verify(username, password, cb) {
  pool.query('SELECT * FROM users WHERE username = $1', [username], function (error, results) {
    if (error) { return cb(error) }
    if (results.rowCount == 0) { return cb(null, false, { message: 'Incorrect username or password.' }) }
    const user = results.rows[0]

    // Hash the input password using the retrieved user's salt
    crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function (error, hashedPassword) {
      if (error) { return cb(error) }

      // SECURITY: Use timingSafeEqual to prevent timing attacks during comparison
      if (!crypto.timingSafeEqual(user.hashed_password, hashedPassword)) {
        return cb(null, false, { message: 'Incorrect username or password.' })
      }
      return cb(null, user)
    })
  })
}))


/**
 * Log in a user.
 * Wraps passport.authenticate to return JSON instead of a redirect.
 */
const verify = (request, response, next) => {
  passport.authenticate('local', (error, user, info) => {

    if (error) {
      return response.status(500).json({ "msg": "Database error", "error": error })
    }

    if (!user) {
      return response.status(401).json({ success: false, message: info.message || 'Login failed' })
    }

    request.logIn(user, (error) => {
      if (error) {
        return response.status(500).json({ "msg": "Database error", "error": error })
      }
      // Send a JSON response. React handles the redirect!
      return response.json({
        success: true,
        user: { id: user.id, username: user.username },
        message: 'Successfully logged in'
      })
    })

  })(request, response, next)
}

/**
 * Middleware: Protect routes requiring authentication.
 * Returns 401 if no session exists.
 */
const checkAuthenticated = (request, response, next) => {
  if (request.isAuthenticated()) {
    return next()
  }
  response.status(401).json({ error: 'Not authorized' })
}

/**
 * Register a new user.
 * Generates a unique salt and hashes the password before storage.
 */
const register = (request, response, next) => {
  const salt = crypto.randomBytes(16)
  crypto.pbkdf2(request.body.password, salt, 310000, 32, 'sha256', function (error, hashedPassword) {
    if (error) { return response.status(500).json({ "msg": "Database error", "error": error }) }
    pool.query('INSERT INTO users (username, hashed_password, salt) VALUES ($1, $2, $3) RETURNING id', [
      request.body.username,
      hashedPassword,
      salt
    ], function (error, results) {

      if (error) { return response.status(500).json({ "msg": "Database error", "error": error }) }
      const newUserId = results.rows[0].id 
      const username = request.body.username 
      response.status(201).json({ "msg": "Succeeded added user:" + username + " with id:" + newUserId, "username": username, "id": newUserId })
    })
  })
}
//TODO: Create an option for a superadmin to change anyones password
//Update password - Can only update own password
const updatePassword = (request, response, next) => {

  const salt = crypto.randomBytes(16)
  if (request.user.username !== request.body.username) {
    return response.status(403).send("Cannot update other users passwords")
  }
  crypto.pbkdf2(request.body.password, salt, 310000, 32, 'sha256', function (error, hashedPassword) {
    if (error) { return response.status(500).json({ "error": error }) }
    const sql = `
      UPDATE users 
      SET hashed_password = $1, salt = $2 
      WHERE username = $3 
      RETURNING id, username`

    pool.query(sql, [
      hashedPassword,
      salt,
      request.body.username
    ], function (error, results) {
      if (error) { return response.status(400).send(error) }
      const user = {
        id: results.rows[0].id,
        username: results.rows[0].username
      }
      // Re-logging the user in with the new credentials
      request.login(user, function (error) {
        if (error) { return response.status(400).send(error) }
        response.status(200).send("Success and relogged in")
      })
    })
  })
}

/**
 * Log out the current user.
 * Destroys the session.
 */
const logout = (request, response, next) => {
  request.logout(function (error) {
    if (error) {
      return response.status(500).json({ error: error.message })
    }
    response.status(200).json({ "msg": "Logged out" })
  })

}

/**
 * Verifies a password without creating a session.
 * Useful for confirming sensitive actions (e.g. before updating settings).
 */
const checkPasswordOnly = (request, response) => {
  const { username, password } = request.body

  pool.query('SELECT * FROM users WHERE username = $1', [username], function (error, results) {
    if (error) return response.status(500).json({ "msg": "Database error", "error": error })
    if (results.rowCount === 0) return response.status(404).json({ "msg": "Not found" })

    const user = results.rows[0]

    crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function (error, hashedPassword) {
      if (error) return response.status(500).json({ "msg": "Hashing error", "error": error })

      if (!crypto.timingSafeEqual(user.hashed_password, hashedPassword)) {
        return response.status(401).json({ valid: false, message: "Incorrect password" })
      }

      return response.status(200).json({ valid: true, message: "Password is correct" })
    })
  })
}

/**
 * Retrieve the currently logged-in user's info.
 */
const getCurrentUser = (request, response) => {
  response.status(200).json({ id: request.user.id, username: request.user.username })
}
module.exports = { verify, register, logout, checkAuthenticated, updatePassword, checkPasswordOnly, getCurrentUser } 