// controllers/callback.js

const axios = require('axios');
const { sendSmsMessage, receiveSmsMessage  } = require('./message');


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

const receiveSmsController = async (req, res) => {

    const messagePayload = req.body;

    console.log("Message Payload:", messagePayload);

    await receiveSmsMessage(req, res);
  
    // Assuming messagePayload contains the necessary information
    const number = messagePayload.number; // adjust based on the actual payload structure
    const content = await getOpenAIResponse(messagePayload.content); // get content from OpenAI
    const status_callback = 'https://example.com/message-status/1234abcd'; // replace with dynamic value if needed
  
    try {
      await sendSmsMessage(number, content);
      res.sendStatus(200);
  
    } catch (error) {
        console.error("Error getting OpenAI response:", error);
        res.status(500).send("Failed to process the message");
    }
  };


  async function getOpenAIResponse(message) {
    const endpoint = "https://api.openai.com/v1/chat/completions";

    const data = {
        messages: [{ "role": "user", "content": message }],
        max_tokens: 150,
        model: "gpt-3.5-turbo",
    };

    const headers = {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.post(endpoint, data, { headers: headers });
        
        return response.data.choices[0].message.content;

    } catch (error) {
        console.error("Error querying OpenAI:", error);
        throw new Error("Sorry, I couldn't process that.");
    }
};

module.exports = {
  handleSmsStatusCallback,
  receiveSmsController,
};