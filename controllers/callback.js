// Imports
const { sendSmsMessage, receiveSmsMessage, processAndStoreMessage } = require('./message');
const { getOpenAIResponse } = require('./openai');
const { summarizeChat } = require('./llm_processing');
const User = require('../models/user');
const Session = require('../models/session');

// Update status of message with SendBlue
const handleSmsStatusCallback = (req, res) => {
  try {
    console.log('Received SMS status update:', req.body);
    res.sendStatus(200);
  } catch (err) {
    console.error('Error handling SMS status callback:', err);
    res.sendStatus(500);
  }
};

// Handle incoming SMS messages
const receiveSmsController = async (req, res) => {
  try {
    await receiveSmsMessage(req, 'user');
    const { number, content } = req.body;
    const user = await User.findOne({ phoneNumber: number });

    const type = 'openai';
    const aiResponse = await getOpenAIResponse(content);

    await processAndStoreMessage(user, number, aiResponse, type);
    await sendSmsMessage(number, aiResponse);

    res.status(200).json({
      status: 'READ',
      type,
      content: aiResponse
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Failed to process the message');
  }
};

// Middleware to manage chat session timeouts
let sessionTimers = {};
const sessionMiddleware = async (req, res, next) => {
  try {
    const { number } = req.body;
    const user = await User.findOne({ phoneNumber: number });  // <-- Add this line
    if (!user) {
      console.warn('User not found for number:', number);
      return res.status(404).send('User not found');
    }
    
    let sessionRecord = await Session.findOne({ phoneNumber: number }).sort({ createdAt: -1 });
    const sessionId = sessionRecord ? sessionRecord._id : null;

    // Clear any existing timeout for the session
    if (sessionTimers[sessionId]) {
      clearTimeout(sessionTimers[sessionId]);
    }

    // Create a new session if needed
    if (!sessionRecord || new Date(sessionRecord.expiresAt) < new Date()) {
      sessionRecord = new Session({ phoneNumber: number, userId: user._id});
      await sessionRecord.save();
      sessionId = sessionRecord._id;
    }

    // Set a timeout to close the session after a period of inactivity
    sessionTimers[sessionId] = setTimeout(async () => {
      await summarizeChat(number);
      await Session.findByIdAndUpdate(sessionId, { expiresAt: new Date() });
      console.log(`Session ${sessionId} closed due to inactivity.`);
    }, 300000); // 5 minutes

    next();
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = {
  handleSmsStatusCallback,
  receiveSmsController,
  sessionMiddleware
};