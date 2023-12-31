const axios = require('axios');
const mongoose = require('mongoose');
const User = require('../models/user');
const Message = require('../models/messages');
const ChatHistory = require('../models/chat_history');

const { summarize_chat } = require('../config/system_prompts');

// Function to get the OpenAI response
async function getBackEndOpenAIResponse(sessionMessages) {
  const endpoint = "https://api.openai.com/v1/chat/completions";

  const transformedSessionMessages = sessionMessages.map(msg => ({ role: msg.type, content: msg.content }));
  console.log("transformedSessionMessages:", transformedSessionMessages);

  let data = {
    messages: [
      { "role": "system", "content": summarize_chat },
      ... transformedSessionMessages, 
    ],
    max_tokens: 800,
    model: "gpt-3.5-turbo",
  };

  data = JSON.stringify(data);
  
  const headers = {
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    'Content-Type': 'application/json'
  };

  console.log("data:", data);

  try {
    const response = await axios.post(endpoint, data, { headers });
    return response.data.choices[0].message.content;

  } catch (error) {

    console.error("Error querying OpenAI:", error);
    throw new Error("Sorry, I couldn't process that.");
  }
};

// Function to summarize chat history
const summarizeChat = async (user, sessionId) => {
  try {
    // Fetch all messages in the current session.
    const sessionMessages = await Message.find({ sessionId }).sort({ timestamp: 1 });
    console.log("sessionMessages:", sessionMessages);

    const openAIResponseString = await getBackEndOpenAIResponse(sessionMessages);
    console.log("openAIResponseString:", openAIResponseString);

    const openAIResponseObject = (typeof openAIResponseString === 'string') 
                              ? JSON.parse(openAIResponseString) 
                              : openAIResponseString;

    const chatSummary = {
      userId: user._id,
      sessionId: sessionId,
      summary: openAIResponseObject
    };
    
    const chatHistory = new ChatHistory(chatSummary);
    await chatHistory.save();

    // Update the User document
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $push: { chatHistory: chatHistory._id } },
      { new: true, useFindAndModify: false }
    );


  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
  }
};

module.exports = { getBackEndOpenAIResponse, 
  summarizeChat, 
};