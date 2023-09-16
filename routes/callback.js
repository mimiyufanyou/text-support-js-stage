// routes/callback.js

const express = require('express');
const router = express.Router();
const smsController = require('../controllers/callback');

// Define endpoints
router.post('/status-callback', smsController.handleSmsStatusCallback);
router.post('/receive-sms', smsController.receiveSmsController); 

module.exports = router;