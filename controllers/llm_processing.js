const axios = require('axios');
const mongoose = require('mongoose');
const User = require('../models/user');
const Message = require('../models/messages');
const ChatHistory = require('../models/chat_history');

const { summarize_chat } = require('../config/system_prompts');

// Function to get the OpenAI response
async function getBackEndOpenAIResponse(message) {
  const endpoint = "https://api.openai.com/v1/chat/completions";
  const data = {
    messages: [
      { "role": "system", "content": summarize_chat },
      { "role": "user", "content": message }
    ],
    max_tokens: 500,
    model: "gpt-3.5-turbo",
  };
  
  const headers = {
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    'Content-Type': 'application/json'
  };

  try {
    const response = await axios.post(endpoint, data, { headers });
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error querying OpenAI:", error);
    throw new Error("Sorry, I couldn't process that.");
  }
}

// Function to summarize chat history
const summarizeChat = async (number) => {
  try {
    const user = await User.findOne({ phoneNumber: number });
    const lastMessage = await Message.findOne({ phoneNumber: number }).sort({ createdAt: -1 });

    const fetchUserSessionRecords = await Message.find({
      userId: user._id,
      sessionId: lastMessage.sessionId
    }, 'content type');

    const openAIResponseString = await getBackEndOpenAIResponse(JSON.stringify(fetchUserSessionRecords));
    const openAIResponse = JSON.parse(openAIResponseString);

    const chatSummary = {
      userId: user._id,
      sessionId: lastMessage.sessionId,
      ...openAIResponse
    };

    console.log("chatSummary", JSON.stringify(chatSummary));

    const chatHistory = new ChatHistory(chatSummary);
    await chatHistory.save();

  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    await mongoose.disconnect(); // Close the DB connection
  }
};

module.exports = { getBackEndOpenAIResponse, summarizeChat };