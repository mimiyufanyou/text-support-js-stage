// controllers/message.js 

const SEND_BLUE_URL = 'https://api.sendblue.co/api/send-message';
const SEND_BLUE_API_KEY_ID = 'a4644ec3f8dcd68d2810d49b1af7448d';
const SEND_BLUE_API_SECRET_KEY = 'c2a8ce6b311f277ae3285971ebad6400';

// Replace these with your actual data
const number = '+16048189821';
const content = 'This is a test message from the SendBlue API';

// Data to send to the webhook
const requestdata = {
  number: number,
  content: content,
  status_callback: 'https://example.com/message-status/1234abcd',
};

const headers = { 
    'sb-api-key-id': SEND_BLUE_API_KEY_ID,
    'sb-api-secret-key': SEND_BLUE_API_SECRET_KEY,
    'content-type': 'application/json'
}

const sendSmsMessage = (req, res) => {
  // Send the SMS message
  axios.post(SEND_BLUE_URL, requestdata, headers)
    .then((response) => {
      console.log('Webhook response:', response.data);
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error('Error sending data to webhook:', error);
      res.sendStatus(500);
    });
};

module.exports = {
  sendSmsMessage, 
};