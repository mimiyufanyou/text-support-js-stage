const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const PORT = process.env.PORT || 5001;

const db = require('./config/db');
console.log(db); 


// Require and use route modules
const userRoutes = require('./routes/user')
const messageRoutes = require('./routes/message');
const callbackRoutes = require('./routes/callback');

// Use middleware and other configurations
app.use(bodyParser.json()); // JSON parsing middleware

// Use routes
app.use('/api/message', messageRoutes);
app.use('/api/callback', callbackRoutes);
app.use('/api/user', userRoutes);

db.connect().then(() => {

    // Start Server 
    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    });

    }).catch(error => {
    console.error("Failed to start due to database error:", error);
});