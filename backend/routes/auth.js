const db = require("../db")
const path = require('path');
var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var crypto = require('crypto');

passport.use(new LocalStrategy(function verify(username, password, cb) {
  db.query('SELECT * FROM users WHERE username = $1', [ username ], function(err, results) {
    if (err) { return cb(err); }
    if (results.rows.length == 0) { return cb(null, false, { message: 'Incorrect username or password.' }); }
    const user = results.rows[0]
    crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
      if (err) { return cb(err); }
      if (!crypto.timingSafeEqual(user.hashed_password, hashedPassword)) {
        return cb(null, false, { message: 'Incorrect username or password.' });
      }
      return cb(null, user);
    });
  });
}));

const login = (request, response) =>{
    response.sendFile(path.join(__dirname, '..', 'public', 'loggedIn.html'));
};

const verify = passport.authenticate('local', {
  successRedirect: '/loggedIn.html',
  failureRedirect: '/index.html'
});

const register = (req, res, next) => {
  const salt = crypto.randomBytes(16);
  crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', function(err, hashedPassword) {
    if (err) { return next(err); }
    db.query('INSERT INTO users (username, hashed_password, salt) VALUES ($1, $2, $3) RETURNING id', [
      req.body.username,
      hashedPassword,
      salt
    ], function(err,results) {
      if (err) { return next(err); }
      const user = {
        id: results.rows[0].id,
        username: req.body.username
      };
      req.login(user, function(err) {
        if (err) { return next(err); }
        res.redirect('/index.html');
      });
    });
  });
}

const logout = (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
};

module.exports = {login, verify, register, logout};