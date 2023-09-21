// controllers/message.js 
const axios = require('axios');
const SEND_BLUE_URL = 'https://api.sendblue.co/api/send-message';
const headers = { 
    'sb-api-key-id': process.env.SEND_BLUE_API_KEY_ID,
    'sb-api-secret-key': process.env.SEND_BLUE_API_SECRET_KEY,
    'content-type': 'application/json'
}

const User = require('../models/user');
const CurrentConversation = require('../models/current_conversation');

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
      console.log('Webhook response:', response.data);
    })
    .catch((error) => {
      console.error('Error sending data to webhook:', error);
    });
};

// receiveSmsMessage 
const receiveSmsMessage = async (req) => {
  try {
  const messagePayload = req.body;
  console.log('Received SMS message:', messagePayload);
  let user = await User.findOne({phoneNumber: req.body.number});

  if (!user) {
    console.log(`User with number ${req.body.number} does not exist, creating user and confirming.`);
    user = new User({ phoneNumber: req.body.number, confirmed: true });
    await user.save();
    await processAndStoreMessage(user, req.body.number, req.body.content);
    return true; 
  }

  if (user && !user.confirmed) {
    console.log(`User with number ${req.body.number} is not confirmed`);
    user.confirmed = true; 
    await user.save();  
    await processAndStoreMessage(user, req.body.number, req.body.content);
    return true; 
  }

  await processAndStoreMessage(user, req.body.number, req.body.content);
  return true; 

  } catch (error) { 
    console.error("Error receiving SMS message:", error);
    return false; 
  }
};

// Process and store the user's answer and update their progress.
const processAndStoreMessage = async (user, phoneNumber, message) => {

  // Look for an existing conversation with this phone number
  console.log(`Looking for conversation with ${phoneNumber}`)

  let conversation = await CurrentConversation.findOne({ phoneNumber : phoneNumber });

  const newMessage = {
    sender: phoneNumber, // Set sender based on your needs, assuming 'user' here
    content: message,
    timestamp: new Date()
  };

  if (!conversation) {
    // Create a new conversation if one doesn't exist
    console.log(`Creating a new conversation for ${phoneNumber}`);

    let user = await User.findOne({ phoneNumber: phoneNumber });

    conversation = new CurrentConversation({
      isActive: true, 
      phoneNumber: phoneNumber,
      messages: [newMessage]
     });

  } else {
    // Add the new message to the existing conversation
    console.log(`Adding message to existing conversation for ${phoneNumber}`);
    conversation.messages.push(newMessage);
    conversation.updatedAt = new Date();
  }

  // Save the updated or new conversation
  await conversation.save();
  console.log(`Stored message for ${phoneNumber}`);
};

module.exports = {
  sendSmsMessage, 
  receiveSmsMessage,
  processAndStoreMessage, 
};