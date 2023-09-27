const axios = require('axios');
const mongoose = require('mongoose');
const User = require('../models/user');  // Replace with your actual User model path
const Message = require('../models/message');  // Replace with your actual Message model path
const ChatHistory = require('../models/chat_history');  // Replace with your actual ChatHistory model path

const { summarize_chat } = require('../config/system_prompts');

async function getBackEndOpenAIResponse(message) {
    const endpoint = "https://api.openai.com/v1/chat/completions";

    const data = {
        messages: [
                { "role": "system", "content": summarize_chat },
                { "role": "user", "content": message }],
        max_tokens: 500,
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

const summarizeChat = async (number) => {
    try {
      const user = await User.findOne({ phoneNumber: number });
      const lastMessage = await Message.findOne({ 
        phoneNumber: number
      }).sort({ createdAt: -1 });
  
      const fetchUserSessionRecords = await Message.find({
        userId: user._id, 
        sessionId: lastMessage.sessionId
      }, 'content type');
  
      const openAIResponseString = await getBackEndOpenAIResponse(JSON.stringify(fetchUserSessionRecords));
  
      // Parse the JSON string to a JavaScript object
      const openAIResponse = JSON.parse(openAIResponseString);
  
      // Create initial chatSummary object with userId and sessionId
      let chatSummary = {
        userId: user._id,
        sessionId: lastMessage.sessionId
      };
  
      // Merge the chatSummary object with the parsed OpenAI response
      chatSummary = {...chatSummary, ...openAIResponse};
  
      // Convert the final object back to a JSON string for logging or other purposes
      const finalJsonString = JSON.stringify(chatSummary);
  
      console.log("chatSummary", finalJsonString);
  
      // Save the chat history
      const chatHistory = new ChatHistory(chatSummary); 
      await chatHistory.save();
  
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      await mongoose.disconnect(); // Close the connection after fetching data
    }
  };

module.exports = { getBackEndOpenAIResponse, summarizeChat};