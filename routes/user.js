// routes/callback.js

const express = require('express');
const passport = require('passport');
const router = express.Router();
const userController = require('../controllers/user');

// Define endpoints
router.post('/get-user-by-number', userController.getUserByPhoneNumber);
router.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));
router.get ('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }),
    function(req, res) {
    res.redirect('/');
    });



module.exports = router;