// controllers/callback.js

const axios = require('axios');

const handleSmsStatusCallback = (req, res) => {
    // Handle the status update here
    const statusUpdate = req.body;
    console.log('Received SMS status update:', statusUpdate);
  
    // Respond with a 200 OK to acknowledge receipt
    res.sendStatus(200);
  };

const receiveSmsController = async (req, res) => {
  const messagePayload = req.body;
  console.log(messagePayload);

  try {
      const response = await getOpenAIResponse(messagePayload.content);
      console.log("OpenAI Response:", response);

      // Do something with the response, if desired.
      // For now, just respond to the incoming webhook

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
}

module.exports = {
  handleSmsStatusCallback,
  receiveSmsController,
};