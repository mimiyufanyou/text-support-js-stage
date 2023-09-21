// routes/callback.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

// Define endpoints
router.post('/get-user-by-number', userController.getUserByPhoneNumber);

module.exports = router;