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

const sendSmsMessage = async (req, res) => {
  const requestData = {
    recipient: req.body.phoneNumber,
    text: req.body.content,
    status_callback: 'https://text-support-test-4c747d031b47.herokuapp.com/api/callback/status-callback'
  };

  try {
    const response = await axios.post(SEND_MSG_URL, requestData, { headers })
    console.log('SMS sent successfully:', response);
    res.status(200).json({ 
      status: 'success', 
      success: true, 
      message: 'SMS sent successfully',
      data: response.data 
    });
    return { 
      status: 'success', 
      success: true,
      data: response.data 
    };
  } catch (error) {
    console.error('Error sending SMS:', error);
    res.status(500).json({
      status: 'failure', 
      message: 'Failed to send SMS', 
      error: error.message
    });
    return {
      status: error.response ? error.response.status : 500,
      success: false,
      error: error.message
    };
  }
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

    const responsePayload = {
      status: 'success',
      success: true,
      type,
      content: text
    };

    res.status(200).json(responsePayload);
    return responsePayload;

  } catch (error) {
    console.error('Error receiving SMS:', error);

    const errorResponse = {
      status: 'failure',
      success: false
    };

    res.status(500).json(errorResponse);
    return errorResponse;
  }
};

// Function to process and store incoming messages
const processAndStoreMessage = async (user, phoneNumber, message, type, was_downgraded) => {
  const session = await Session.findOne({ phoneNumber }).sort({ createdAt: -1 });

  if (session && new Date(session.expiresAt) >= new Date()) {
    const newMessage = {
      phoneNumber,
      userId: user._id,
      sessionId: session._id,
      content: message,
      type,
      was_downgraded,
      timestamp: new Date(),
    };

    const newMessageDoc = new Message(newMessage);
    await newMessageDoc.save();
  } else {
    console.warn(`No active session found for phone number ${phoneNumber}`);
  }
};

module.exports = {
  sendSmsMessage,
  receiveSmsMessage,
  processAndStoreMessage
};