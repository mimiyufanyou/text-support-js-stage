const axios = require('axios');
const User = require('../models/user');
const Message = require('../models/messages');
const Session = require('../models/session');

const SEND_BLUE_URL = 'https://api.sendblue.co/api/send-message';
const headers = {
  'sb-api-key-id': process.env.SEND_BLUE_API_KEY_ID,
  'sb-api-secret-key': process.env.SEND_BLUE_API_SECRET_KEY,
  'content-type': 'application/json'
};

// Function to send SMS message using SendBlue
const sendSmsMessage = (phoneNumber, content) => {
  const requestData = {
    number: phoneNumber,
    content,
    status_callback: 'https://example.com/message-status/1234abcd',
  };

  return axios.post(SEND_BLUE_URL, requestData, { headers })
    .then((response) => {
      // Handle success, if needed
    })
    .catch((error) => {
      console.error('Error sending SMS:', error);
    });
};

// Function to handle incoming SMS messages
const receiveSmsMessage = async (req, type) => {
  let status = 'DELIVERED';

  try {
    const { number, content, was_downgraded } = req.body;
    let user = await User.findOne({ phoneNumber: number });

    if (!user) {
      user = new User({ phoneNumber: number, confirmed: true });
      await user.save();
    } else if (!user.confirmed) {
      user.confirmed = true;
      await user.save();
    }

    await processAndStoreMessage(user, number, content, type, was_downgraded, status);
    status = 'READ';

    return { status, success: true };

  } catch (error) {
    console.error('Error receiving SMS:', error);
    return { status, success: false };
  }
};

// Function to process and store incoming messages
const processAndStoreMessage = async (user, phoneNumber, message, type, was_downgraded, status) => {
  const session = await Session.findOne({ phoneNumber }).sort({ createdAt: -1 });

  if (session && new Date(session.expiresAt) >= new Date()) {
    const newMessage = {
      phoneNumber,
      userId: user._id,
      sessionId: session._id,
      content: message,
      type,
      was_downgraded,
      status,
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