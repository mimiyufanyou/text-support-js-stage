const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();
const path = require('path');

const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5001;

const db = require('./config/db');
console.log(db); 

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "https://text-support-test-4c747d031b47.herokuapp.com/status-callback"
},
function(accessToken, refreshToken, profile, cb) {
  User.findOrCreate({ googleId: profile.id }, function (err, user) {
    if (err) {
      return cb(err, null);
    }
    return cb(null, user);
  });
}));


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

