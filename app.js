const express = require('express');
const app = express();
const PORT = process.env.PORT || 5001;
const axios = require('axios');

// Require and use route modules
const messageRoutes = require('./routes/message');
const callbackRoutes = require('./routes/callback');

// Use middleware and other configurations
app.use(express.json()); // JSON parsing middleware

// Use routes
app.use('/api/message', messageRoutes);
app.use('/api/callback', callbackRoutes);

// Start Server 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});