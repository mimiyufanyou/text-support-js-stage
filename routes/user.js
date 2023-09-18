// routes/callback.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

// Define endpoints
router.post('/update-user-settings', userController.updateSystemSettings);

module.exports = router;