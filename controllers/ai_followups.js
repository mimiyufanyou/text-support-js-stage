const axios = require('axios');  // Make sure to import axios if you haven't already
const { userChatHistory } = require('./userchathist');
const { agenda } = require('../agenda');
const moment = require('moment');

async function getFollowUpsOpenAIResponse(userChats) {
  const endpoint = "https://api.openai.com/v1/chat/completions";

  const { summary: lastChatSummary, actionItems: lastChatActionItems } = userChats.lastChat || {};
  const { summary: prevChatSummary, actionItems: prevChatActionItems } = userChats.prevChat || {};

  const systemMessage1 = `Inquire how user is doing and follow up based on the summaries last chat: ${lastChatSummary} and action items last chat: ${lastChatActionItems} from previous chats.`
  const systemMessage2 = `Inquire how user is doing and follow up based on the summaries last chat: ${prevChatSummary} and action items last chat: ${prevChatActionItems} from previous chats.`
  
  const data = {
    messages: [
      { "role": "system", "content": systemMessage1 }, 
      { "role": "system", "content": systemMessage2 }
    ],
    max_tokens: 1000,
    model: "gpt-3.5-turbo",
  };

  const headers = {
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    'Content-Type': 'application/json'
  };

  console.log("data:", data);

  try {
    const response = await axios.post(endpoint, data, { headers: headers });
    return response.data.choices[0].message.content;

  } catch (error) {
    console.error("Error querying OpenAI:", error);
    throw new Error("Sorry, I couldn't process that.");
  }
};

const scheduleFollowUp = async (userId) => {
  console.log('Schedule follow-up called', userId);
  
  try {
    await agenda.start();

    const userChats = await userChatHistory(userId);
    const latestFrequencyOfFollowUp = userChats.lastChat ? userChats.lastChat.frequencyOfFollowUp : null;

    if (!latestFrequencyOfFollowUp) {
      console.log('No follow-up frequency found.');
      return;
    }

    console.log('Frequency of Follow Up:', latestFrequencyOfFollowUp);

    const [value, unit] = latestFrequencyOfFollowUp.split(' '); 
    const nextFollowUp = moment().add(value, unit).toDate(); 
    console.log('Next Follow-Up:', nextFollowUp);

    agenda.schedule(nextFollowUp, 'process follow-ups', { userId: userId });
  } catch (error) {
    console.error('An error occurred:', error);
  }
};

module.exports = { getFollowUpsOpenAIResponse, scheduleFollowUp };