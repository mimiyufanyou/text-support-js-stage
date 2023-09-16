const express = require('express');
const app = express();
const PORT = process.env.PORT || 5001;
const connectDB = require('./config/db');

// Connect to the database
connectDB();

// Require and use route modules
const messageRoutes = require('./routes/message');
const callbackRoutes = require('./routes/callback');

// Use middleware and other configurations
app.use(express.json()); // JSON parsing middleware

// Use routes
app.use('/api/message', messageRoutes);
app.use('/api/callback', callbackRoutes);

db.connect().then(() => {

    // Start Server 
    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    });

    }).catch(error => {
    console.error("Failed to start due to database error:", error);
});