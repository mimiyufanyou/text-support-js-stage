// Imports
const { sendSmsMessage, receiveSmsMessage, processAndStoreMessage } = require('./message');
const { getOpenAIResponse } = require('./openai');
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
    await receiveSmsMessage(req, 'user');
    const { number, content } = req.body;
    const user = await User.findOne({ phoneNumber: number });

    const sessionId = req.sessionId;  // Access sessionId from req object

    // Fetch all messages in the current session.
    const sessionMessages = await Message.find({ sessionId }).sort({ timestamp: 1 });

    const type = 'assistant';
    const aiResponse = await getOpenAIResponse(content, sessionMessages);

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
    let { number } = req.body;
    let user = await User.findOne({ phoneNumber: number });  // <-- Add this line

    if (!user) {
      user = new User({ phoneNumber: number, confirmed: true });
      await user.save();
    } else if (!user.confirmed) {
      user.confirmed = true;
      await user.save();
    }

    let sessionRecord = await Session.findOne({ phoneNumber: number }).sort({ createdAt: -1 });
    let sessionId = sessionRecord ? sessionRecord._id : null;

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