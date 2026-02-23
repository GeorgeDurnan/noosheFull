const pool = require("../db")
const path = require('path');
var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var crypto = require('crypto');

passport.use(new LocalStrategy(function verify(username, password, cb) {
  pool.query('SELECT * FROM users WHERE username = $1', [username], function (err, results) {
    if (err) { return cb(err); }
    if (results.rows.length == 0) { return cb(null, false, { message: 'Incorrect username or password.' }); }
    const user = results.rows[0]
    crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function (err, hashedPassword) {
      if (err) { return cb(err); }
      if (!crypto.timingSafeEqual(user.hashed_password, hashedPassword)) {
        return cb(null, false, { message: 'Incorrect username or password.' });
      }
      return cb(null, user);
    });
  });
}));


const verify = (req, res, next) => {
  // We use a custom callback: (err, user, info)
  passport.authenticate('local', (err, user, info) => {

    // 1. Handle Server Errors
    if (err) {
      return next(err);
    }

    // 2. Handle Login Failure (Incorrect password/User not found)
    if (!user) {
      // 'info.message' comes from your LocalStrategy code: { message: 'Incorrect username...' }
      return res.status(401).json({ success: false, message: info.message || 'Login failed' });
    }

    // 3. Handle Login Success
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }

      // Send a JSON response. React handles the redirect!
      return res.json({
        success: true,
        user: { id: user.id, username: user.username },
        message: 'Successfully logged in'
      });
    });

  })(req, res, next); // <--- Important: This invokes the authentication function
};
const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Not authorized' });
};

const register = (req, res, next) => {
  const salt = crypto.randomBytes(16);
  crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', function (err, hashedPassword) {
    if (err) { return res.status(400).send(err); }
    pool.query('INSERT INTO users (username, hashed_password, salt) VALUES ($1, $2, $3) RETURNING id', [
      req.body.username,
      hashedPassword,
      salt
    ], function (err, results) {
      if (err) { return res.status(400).send(err); }
      const user = {
        id: results.rows[0].id,
        username: req.body.username
      };
      res.status(200).send("Succeeded added user:" + user.username + " with id:" + user.id);
    });
  });
}
const updatePassword = (req, res, next) => {

  const salt = crypto.randomBytes(16);
  if (req.user.username !== req.body.username) {
    return res.status(400).send("Cannot update other users passwords")
  }
  crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', function (err, hashedPassword) {
    if (err) { return res.status(400).send(err); }

    // Changed INSERT to UPDATE
    // We use WHERE username = $3 to target the specific user
    const sql = `
      UPDATE users 
      SET hashed_password = $1, salt = $2 
      WHERE username = $3 
      RETURNING id, username`;

    pool.query(sql, [
      hashedPassword,
      salt,
      req.body.username // The unique identifier for the WHERE clause
    ], function (err, results) {
      if (err) { return res.status(400).send(err); }

      // Check if a user was actually found and updated
      if (results.rows.length === 0) {
        return res.status(404).send('User not found');
      }

      const user = {
        id: results.rows[0].id,
        username: results.rows[0].username
      };
      // Re-logging the user in with the new credentials
      req.login(user, function (err) {
        if (err) { return res.status(400).send(err); }
        res.status(200).send("Success and relogged in")
      });
    });
  });
}

const logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      // Using 500 because it's a server-side error, not a "Not Found" 404
      return res.status(500).json({ error: err.message });
    }

    // You MUST send the response
    res.status(200).send("OK");
  });

};
const checkPasswordOnly = (req, res) => {
  const { username, password } = req.body;

  // 1. Fetch user from db
  pool.query('SELECT * FROM users WHERE username = $1', [username], function (err, results) {
    if (err) return res.status(500).send(err);
    if (results.rows.length === 0) return res.status(401).send("Not found");

    const user = results.rows[0];

    // 2. Hash the provided password using the stored salt
    crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function (err, hashedPassword) {
      if (err) return res.status(500).json({ error: "Hashing error" });

      // 3. Compare without logging in
      if (!crypto.timingSafeEqual(user.hashed_password, hashedPassword)) {
        return res.status(401).json({ valid: false, message: "Incorrect password" });
      }

      // Success - but we DO NOT call req.logIn() here
      return res.status(200).json({ valid: true, message: "Password is correct" });
    });
  });
};

module.exports = { verify, register, logout, checkAuthenticated, updatePassword, checkPasswordOnly };