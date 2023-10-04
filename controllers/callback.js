// Imports
const { sendSmsMessage, sendSms, receiveSmsMessage, processAndStoreMessage } = require('./message');
const { getOpenAIResponse } = require('./openai');
const { getPANASResponse } = require('./emotion');
const { summarizeChat } = require('./llm_processing');

const User = require('../models/user');
const Session = require('../models/session');
const Message = require('../models/messages');

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
    const { number, content } = await receiveSmsMessage(req, res, 'user');
    const user = await User.findOne({ phoneNumber: number });
    const sessionId = req.sessionId;  // Access sessionId from req object attached from sessionMiddleware

    console.log('Session ID:', sessionId)
    console.log('User:', user)
    console.log('Number:', number, 'Content:', content)

    // Fetch all messages in the current session.
    const sessionMessages = await Message.find({ sessionId }).sort({ timestamp: 1 });

    // Get OpenAI Response and send it back to the user
    const type = 'assistant';
    const aiResponse = await getOpenAIResponse(content, sessionMessages);

    await processAndStoreMessage(user, number, aiResponse, type);
    await sendSms(number, aiResponse);
    await getPANASResponse(sessionMessages)
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Failed to process the message');
  }
};

// Middleware to manage chat session timeouts
let sessionTimers = {};
const sessionMiddleware = async (req, res, next) => {

  console.log('Session middleware called', req.body)

  try {
    let user = await User.findOne({ phoneNumber: req.body.recipient });  // <-- Add this line

    if (!user) {
      user = new User({ phoneNumber: req.body.recipient, confirmed: true });
      await user.save();
    } else if (!user.confirmed) {
      user.confirmed = true;
      await user.save();
    }

    let sessionRecord = await Session.findOne({ phoneNumber: req.body.recipient }).sort({ createdAt: -1 });
    let sessionId = sessionRecord ? sessionRecord._id : null;

    // Clear any existing timeout for the session
    if (sessionTimers[sessionId]) {
      clearTimeout(sessionTimers[sessionId]);
    }

    // Create a new session if needed
    if (!sessionRecord || new Date(sessionRecord.expiresAt) < new Date()) {
      sessionRecord = new Session({ phoneNumber: req.body.recipient, userId: user._id});
      await sessionRecord.save();
      sessionId = sessionRecord._id;
    }

    // Set a timeout to close the session after a period of inactivity
    sessionTimers[sessionId] = setTimeout(async () => {
      await summarizeChat(user, sessionId);
      await Session.findByIdAndUpdate(sessionId, { expiresAt: new Date() });
      console.log(`Session ${sessionId} closed due to inactivity.`);
    }, 300000); // 5 minutes

    req.sessionId = sessionId;  // Attach sessionId to the req object
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