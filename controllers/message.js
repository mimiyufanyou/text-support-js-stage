// controllers/message.js 
const axios = require('axios');
const SEND_BLUE_URL = 'https://api.sendblue.co/api/send-message';
const headers = { 
    'sb-api-key-id': process.env.SEND_BLUE_API_KEY_ID,
    'sb-api-secret-key': process.env.SEND_BLUE_API_SECRET_KEY,
    'content-type': 'application/json'
}

const User = require('../models/user');
const Message = require('../models/messages');
const Session = require('../models/session');

const sendSmsMessage = (phoneNumber, content) => {
  // Data received from the webhook
  const requestdata = {
    number: phoneNumber,
    content: content,
    status_callback: 'https://example.com/message-status/1234abcd',
    };

  // Send the SMS message
  return axios.post(SEND_BLUE_URL, requestdata, { headers: headers })
    .then((response) => {
      //console.log('Webhook response:', response.data);
    })
    .catch((error) => {
      //console.error('Error sending data to webhook:', error);
    });
};

// receiveSmsMessage 
const receiveSmsMessage = async (req, type) => {
  let status = 'DELIVERED'

  try {
  const messagePayload = req.body;

  //console.log('Received SMS message:', messagePayload);
  let user = await User.findOne({phoneNumber: req.body.number});

  if (!user) {
    //console.log(`User with number ${req.body.number} does not exist, creating user and confirming.`);
    user = new User({ phoneNumber: req.body.number, confirmed: true });
    await user.save();
    await processAndStoreMessage(user, req.body.number, req.body.content, type, req.body.was_downgraded, req.body.status);
    return true; 
  }

  if (user && !user.confirmed) {
   // console.log(`User with number ${req.body.number} is not confirmed`);
    user.confirmed = true; 
    await user.save();  
    await processAndStoreMessage(user, req.body.number, req.body.content, type, req.body.was_downgraded, req.body.status);
    return true; 
  }

  await processAndStoreMessage(user, req.body.number, req.body.content, type, req.body.was_downgraded, req.body.status);

  status = 'READ';
  return { status: status, success: true }; 

  } catch (error) { 
    console.error("Error receiving SMS message:", error);
    return { status: status, success: false} ; 
  }
};

// Process and store the user's answer and update their progress.
const processAndStoreMessage = async (user, phoneNumber, message, type, was_downgraded, status) => {
  
  // Use a transaction to handle race condition
  const session = await Session.startSession();
  session.startTransaction();

  try {
    let conversation = await Session.findOne({ phoneNumber: phoneNumber }).sort({ createdAt: -1 }).session(session);

    if (!conversation || (new Date(conversation.expiresAt)) < new Date()) {
      // Create a new conversation
      conversation = new Session({
        phoneNumber: phoneNumber,
        userId: user._id,
      });

      await conversation.save({ session: session });
    }

    // Add the new message to the conversation (either new or existing)
    const newMessage = {
      phoneNumber: phoneNumber,
      userId: user._id,
      sessionId: conversation._id, // Use the ID from the found or newly created session
      content: message,
      type: type,
      was_downgraded: was_downgraded,
      status: status,
      timestamp: new Date()
    };

    const newMessageDoc = new Message(newMessage);
    await newMessageDoc.save({ session: session });

    await session.commitTransaction();
    session.endSession();

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

module.exports = {
  sendSmsMessage, 
  receiveSmsMessage,
  processAndStoreMessage
};