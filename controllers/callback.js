// controllers/callback.js
const { sendSmsMessage, receiveSmsMessage, processAndStoreMessage  } = require('./message');
const { getOpenAIResponse } = require('./openai');

const User = require('../models/user');
const Quiz = require('../models/quiz');
const Message = require('../models/messages');

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


module.exports = {
  handleSmsStatusCallback,
  receiveSmsController,
};