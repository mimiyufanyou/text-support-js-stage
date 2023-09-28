// controllers/callback.js
const { sendSmsMessage, receiveSmsMessage, processAndStoreMessage  } = require('./message');
const { getOpenAIResponse } = require('./openai');

const User = require('../models/user');

// Update SendBlue on status of message 
const handleSmsStatusCallback = (req, res) => {
    try {
        const statusUpdate = req.body;
        console.log('Received SMS status update:', statusUpdate);
        res.sendStatus(200);
    } catch (err) {
        console.error('Error handling SMS status callback:', err);
        res.sendStatus(500);
    }
};

const conversationSequence = ['onboarding', 'thought_starters', 'stress'];

const receiveSmsController = async (req, res) => {
  try {
    await receiveSmsMessage(req, 'user');
    const messagePayload = req.body;
    const number = messagePayload.number;
    const user = await User.findOne({ phoneNumber: number });

    let content;
    let type;

    content = await getOpenAIResponse(messagePayload.content);
    type = 'openai';

    await processAndStoreMessage(user, number, content, type);

    // Send SMS and respond
    await sendSmsMessage(number, content);
    res.sendStatus(200);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Failed to process the message");
  }
};

let sessionTimers = {}; // Store timers for multiple sessions

const sessionMiddleware = async (req, res, next) => {
  try {
    const phoneNumber = req.body.number;
    const sessionRecord = await Session.findOne({ phoneNumber: phoneNumber }).sort({ createdAt: -1 });
    const sessionId = sessionRecord ? sessionRecord._id : null;

    console.log('Session ID:', sessionId);
    console.log('Session record:', sessionRecord);
    console.log('phone number:', phoneNumber);

    if (sessionTimers[sessionId]) {
      clearTimeout(sessionTimers[sessionId]);
    }
    
    sessionTimers[sessionId] = setTimeout(async () => {
      console.log('Session closed due to inactivity.');
      await summarizeChat(phoneNumber);

      if (sessionId) {
        await Session.findByIdAndUpdate(sessionId, { expiresAt: new Date() });
        console.log('Session expiresAt field updated.');
      }
    }, 900000); // 15 minutes
    
    next();
  } catch (error) {
    console.log('An error occurred:', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = {
  handleSmsStatusCallback,
  receiveSmsController,
  sessionMiddleware
};