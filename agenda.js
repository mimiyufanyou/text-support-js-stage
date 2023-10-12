// then we can go ahead to require and use it 
const mongoose = require('mongoose');
const Agenda = require('agenda');
const { connect } = require('./config/db');
require('dotenv').config();
const { sendSms } = require('./controllers/message'); 
const { processUserFollowUps } = require('./controllers/userchathist');


// Initialize Agenda
const agenda = new Agenda({ 
    mongo: mongoose.connection,  // Reuse the mongoose connection
  });

  agenda.define('send sms follow-up', async (job) => { 
    try {
      const { to, message } = job.attrs.data;
      await sendSms(to, message);
      console.log('Job executed!', job.attrs.data);
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      job.unlock();
    }
  });

  agenda.define('process follow-ups', async (job) => {
    try {
    const { phoneNumber, userId } = job.attrs.data;
    await processUserFollowUps(phoneNumber, userId);
    console.log("Executing 'send sms follow-up'");
    } catch (e) {
      console.error("Error in 'send sms follow-up':", e);
    } finally {
      job.unlock();
    }
  });

module.exports = { agenda }; 