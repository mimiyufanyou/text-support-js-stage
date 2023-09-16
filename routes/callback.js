// routes/callback.js

const express = require('express');
const router = express.Router();
const smsController = require('../controllers/callback');

// Define the status callback endpoint
router.post('/sms-status-callback', smsController.handleSmsStatusCallback);

module.exports = router;