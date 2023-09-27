// routes/callback.js

const express = require('express');
const router = express.Router();
const { sessionMiddleware, smsController } = require('../controllers/callback');

// Define endpoints
router.post('/status-callback', sessionMiddleware, smsController.handleSmsStatusCallback);
router.post('/receive-sms', sessionMiddleware, smsController.receiveSmsController); 

module.exports = router;