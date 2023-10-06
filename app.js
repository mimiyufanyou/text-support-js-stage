const express = require('express');
const app = express();
const path = require('path');

const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5001;

const db = require('./config/db');
console.log(db); 

// Require and use route modules
const userRoutes = require('./routes/user')
const messageRoutes = require('./routes/message');
const callbackRoutes = require('./routes/callback');
const stripeRoutes = require('./routes/stripe');

const agenda = require('agenda');

// Use middleware and other configurations
app.use(bodyParser.json()); // JSON parsing middleware

// Use routes
app.use('/api/message', messageRoutes);
app.use('/api/callback', callbackRoutes);
app.use('/api/user', userRoutes);
app.use('/api/stripe', stripeRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build'))); // Serve static files from the React app

// The "catchall" handler: for any request that doesn't
app.get('*', (req, res) => {
     res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

db.connect().then(async () => {

    // Start Agenda
  //  await agenda.start();
  //  console.log("Agenda started successfully");

  //  agenda.now('send sms follow-up', { to: '+16048189821', message: 'Hiiii me! This is from Agenda woo!' });
  // agenda.every('1 day', 'send sms follow-up', { to: '+16048189821', message: 'A CELEBRATIONN~!!! OF SPAAAAM!' });

    // Start Server 
    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    });

    }).catch(error => {
    console.error("Failed to start due to database error:", error);
});

// Graceful shutdown
//process.on('SIGTERM', async () => {
//    await agenda.stop();
//    process.exit(0);
//    });

