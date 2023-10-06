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

module.exports = { agenda }; 