// then we can go ahead to require and use it 
const mongoose = require('mongoose');
const Agenda = require('agenda');
const { connect } = require('./config/db');
require('dotenv').config();

const { sendSms } = require('./controllers/message'); 


// Initialize Agenda
const agenda = new Agenda({ 
    mongo: mongoose.connection,  // Reuse the mongoose connection
  });

  agenda.define('send sms follow-up', async (job) => { 
    try {
      const { to, message } = job.attrs.data;
      await sendSms(to, message);
      console.log('Job executed!');
    } catch (error) {
      console.error('An error occurred:', error);
    }
  });

// Connect and fetch user data
connect().then(async () => {

    // Start Agenda
    await agenda.start();

    agenda.now('send sms follow-up', { to: '+16048189821', message: 'Hiiii me! This is from Agenda woo!' });
    agenda.every('30 seconds', 'send sms follow-up', { to: '+16048189821', message: 'A CELEBRATIONN~!!! OF SPAAAAM!' });
  
}).catch(error => {
console.error("Failed to start due to database error:", error);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
await agenda.stop();
process.exit(0);
});