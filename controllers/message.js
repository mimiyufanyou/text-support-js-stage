const axios = require('axios');
const User = require('../models/user');
const Message = require('../models/messages');
const Session = require('../models/session');

const SEND_MSG_URL = 'https://server.loopmessage.com/api/v1/message/send/';
const headers = {
  'Authorization': process.env.LOOPAUTH,
  'Loop-Secret-Key': process.env.LOOPSECRET,
  'Content-Type': 'application/json'
};

const sendSms = async (phoneNumber, content) => {
  const requestData = {
    recipient: phoneNumber,
    text: content,
    status_callback: 'https://text-support-test-4c747d031b47.herokuapp.com/api/callback/status-callback'
  };

  try {
    const response = await axios.post(SEND_MSG_URL, requestData, { headers })
    console.log('SMS sent successfully:', response);
    return { 
      status: 'success', 
      success: true,
      data: response.data 
    };
  } catch (error) {
    console.error('Error sending SMS:', error);
    return {
      status: error.response ? error.response.status : 500,
      success: false,
      error: error.message
    };
  }
};

// Express route for sending an SMS
const sendSmsMessage = async (req, res) => {
  const { phoneNumber, content } = req.body;
  const result = await sendSms(phoneNumber, content);

  res.status(result.success ? 200 : 500).json(result);
};

// Function to handle incoming SMS messages
const receiveSmsMessage = async (req, res, type) => {
  const { recipient, text } = req.body;

  try {
    let user = await User.findOne({ phoneNumber: recipient });

    if (!user) {
      user = await User.create({ phoneNumber: recipient, confirmed: true });
    } else if (!user.confirmed) {
      user.confirmed = true;
      await user.save();
    }

    await processAndStoreMessage(user, recipient, text, type);

    res.status(200).json({
      status: 'success',
      success: true,
      message: 'SMS received successfully and stored', 
      type,
      content: text, 
      req: req 
    });
    return {
      status: 'success',
      success: true,
      type,
      content: text, 
      number: recipient, 
      req: req 
    };
  } catch (error) {
    console.error('Error receiving SMS:', error);
    res.status(500).json({
      status: 'failure',
      success: false, 
      message: 'Failed to receive SMS',
  });
  return { 
    status: error.response ? error.response.status : 500,
    success: false, 
    error: error.message 
  };
  }
};

// Function to process and store incoming messages
const processAndStoreMessage = async (user, phoneNumber, message, type) => {
  const session = await Session.findOne({ phoneNumber }).sort({ createdAt: -1 });

  if (session && new Date(session.expiresAt) >= new Date()) {
    const newMessage = {
      phoneNumber,
      userId: user._id,
      sessionId: session._id,
      content: message,
      type,
      timestamp: new Date(),
    };

    const newMessageDoc = new Message(newMessage);
    await newMessageDoc.save();
  } else {
    console.warn(`No active session found for phone number ${phoneNumber}`);
  }
};

module.exports = {
  sendSms,
  sendSmsMessage,
  receiveSmsMessage,
  processAndStoreMessage
};