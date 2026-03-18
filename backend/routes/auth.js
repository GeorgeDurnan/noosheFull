const pool = require("../db")
var passport = require('passport') 
var LocalStrategy = require('passport-local') 
var crypto = require('crypto') 

// STRATEGY: Local Username/Password
// Verifies credentials by matching the hashed input against the stored hash.
passport.use(new LocalStrategy(function verify(username, password, cb) {
  pool.query('SELECT * FROM users WHERE username = $1', [username], function (err, results) {
    if (err) { return cb(err)  }
    if (results.rows.length == 0) { return cb(null, false, { message: 'Incorrect username or password.' })  }
    const user = results.rows[0]

    // Hash the input password using the retrieved user's salt
    crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function (err, hashedPassword) {
      if (err) { return cb(err)  }

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
const verify = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {

    if (err) {
      return next(err) 
    }

    if (!user) {
      return res.status(401).json({ success: false, message: info.message || 'Login failed' }) 
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err) 
      }

      // Send a JSON response. React handles the redirect!
      return res.json({
        success: true,
        user: { id: user.id, username: user.username },
        message: 'Successfully logged in'
      }) 
    }) 

  })(req, res, next) 
} 

/**
 * Middleware: Protect routes requiring authentication.
 * Returns 401 if no session exists.
 */
const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next() 
  }
  res.status(401).json({ error: 'Not authorized' }) 
} 

/**
 * Register a new user.
 * Generates a unique salt and hashes the password before storage.
 */
const register = (req, res, next) => {
  const salt = crypto.randomBytes(16) 
  crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', function (err, hashedPassword) {
    if (err) { return res.status(500).send(err)  }
    pool.query('INSERT INTO users (username, hashed_password, salt) VALUES ($1, $2, $3) RETURNING id', [
      req.body.username,
      hashedPassword,
      salt
    ], function (err, results) {
      if (err) { return res.status(500).send(err)  }
      res.status(201).json({ "msg": "Succeeded added user:" + user.username + " with id:" + user.id, "username": user.username, "id": user.id }) 
    }) 
  }) 
}
//TODO: Create an option for a superadmin to change anyones password
//Update password - Can only update own password
const updatePassword = (req, res, next) => {

  const salt = crypto.randomBytes(16) 
  if (req.user.username !== req.body.username) {
    return res.status(403).send("Cannot update other users passwords")
  }
  crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', function (err, hashedPassword) {
    if (err) { return res.status(500).json({ "error": err })  }
    const sql = `
      UPDATE users 
      SET hashed_password = $1, salt = $2 
      WHERE username = $3 
      RETURNING id, username` 

    pool.query(sql, [
      hashedPassword,
      salt,
      req.body.username 
    ], function (err, results) {
      if (err) { return res.status(400).send(err)  }
      if (results.rows.length === 0) {
        return res.status(404).send('User not found') 
      }

      const user = {
        id: results.rows[0].id,
        username: results.rows[0].username
      } 
      // Re-logging the user in with the new credentials
      req.login(user, function (err) {
        if (err) { return res.status(400).send(err)  }
        res.status(200).send("Success and relogged in")
      }) 
    }) 
  }) 
}

/**
 * Log out the current user.
 * Destroys the session.
 */
const logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return res.status(500).json({ error: err.message }) 
    }
    res.status(200).send("OK") 
  }) 

} 

/**
 * Verifies a password without creating a session.
 * Useful for confirming sensitive actions (e.g. before updating settings).
 */
const checkPasswordOnly = (req, res) => {
  const { username, password } = req.body 

  pool.query('SELECT * FROM users WHERE username = $1', [username], function (err, results) {
    if (err) return res.status(500).send(err) 
    if (results.rows.length === 0) return res.status(401).send("Not found") 

    const user = results.rows[0] 

    crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function (err, hashedPassword) {
      if (err) return res.status(500).json({ error: "Hashing error" }) 

      if (!crypto.timingSafeEqual(user.hashed_password, hashedPassword)) {
        return res.status(401).json({ valid: false, message: "Incorrect password" }) 
      }

      return res.status(200).json({ valid: true, message: "Password is correct" }) 
    }) 
  }) 
} 

/**
 * Retrieve the currently logged-in user's info.
 */
const getCurrentUser = (request, response) => {
  if (request.isAuthenticated()) {
    response.json({ id: request.user.id, username: request.user.username }) 
  } else {
    response.status(401).json({ error: 'Not logged in' }) 
  }
}
module.exports = { verify, register, logout, checkAuthenticated, updatePassword, checkPasswordOnly, getCurrentUser } 