// controllers/callback.js

const axios = require('axios');

const { sendSmsMessage } = require('./message');
const { createUser, getUserByPhoneNumber, appendToChatHistory, updateSystemSettings } = require('./user');
const questions = require('../config/questions.js'); 




const handleSmsStatusCallback = (req, res) => {
    // Handle the status update here
    const statusUpdate = req.body;
    console.log('Received SMS status update:', statusUpdate);
  
    // Respond with a 200 OK to acknowledge receipt
    res.sendStatus(200);
  };

  const receiveSmsController = async (req, res) => {
    const messagePayload = req.body;
  
    const number = messagePayload.number;
  
    try {
      let user = await getUserByPhoneNumber(number);
  
      if (!user) {
        user = await createUser({
          phoneNumber: number,
          chatHistory: [],
          systemSettings: [{
            context: "",
            state: "NOT_STARTED",
            answers: "",
            currentQuestion: 1
          }]
        });
      }
  
      let content;
      const currentQuestionIndex = user.systemSettings[0].currentQuestion - 1;
  
      if (user.systemSettings[0].state === "NOT_STARTED" || currentQuestionIndex < questions.length) {
        // If the user hasn't started or hasn't finished the questionnaire:
        content = questions[currentQuestionIndex];
        await updateSystemSettings(number, {
          ...user.systemSettings[0],
          state: "IN_PROGRESS",
          currentQuestion: user.systemSettings[0].currentQuestion + 1
        });
      } else {
        // User has finished all questions, you can process their message normally
        content = await getOpenAIResponse(messagePayload.content);
      }
  
      await appendToChatHistory(number, {
        role: "user",
        content: messagePayload.content,
        timestamp: new Date()
      });
  
      await sendSmsMessage(number, content);
      res.sendStatus(200);
  
    } catch (error) {
      console.error("Error processing SMS:", error);
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