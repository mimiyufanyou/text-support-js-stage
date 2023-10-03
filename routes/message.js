const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message');

// Define message-related routes
router.post('/message', messageController.sendSms);

module.exports = router;