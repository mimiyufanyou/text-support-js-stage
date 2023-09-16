// controllers/message.js 

const SEND_BLUE_URL = 'https://api.sendblue.co/api/send-message';

const headers = { 
    'sb-api-key-id': process.env.SEND_BLUE_API_KEY_ID,
    'sb-api-secret-key': process.env.SEND_BLUE_API_SECRET_KEY,
    'content-type': 'application/json'
}

const sendSmsMessage = (req, res) => {

  // Data received from the webhook
  const requestdata = {
    number: number,
    content: content,
    status_callback: 'https://example.com/message-status/1234abcd',
    };

  // Send the SMS message
  return axios.post(SEND_BLUE_URL, requestdata, { headers: headers })
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