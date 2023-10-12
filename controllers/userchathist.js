const User = require('../models/user');
const Message = require('../models/messages');
const ChatHistory = require('../models/chat_history');
const { sendSms } = require('./message');
const { getFollowUpsOpenAIResponse } = require('./ai_followups');


async function userChatHistory(identifier) {
  try {
    console.log(`Fetching chat history for identifier: ${identifier}...`);
    
    const user = await User.findOne({
      $or: [
        { _id: identifier },
        { phoneNumber: identifier }
      ]
    })
    .populate({
      path: 'chatHistory',
      populate: { path: 'summary' }
    })
    .lean()
    .exec();

    if (!user) {
      console.log(`User with identifier: ${identifier} not found.`);
      return null;
    }

    console.log("Fetched user successfully!");

    const reversedChats = [...user.chatHistory].reverse();
    const lastChatWithActionItems = reversedChats.find(chat => chat.summary.frequencyOfFollowUp);
    const prevChatIndex = reversedChats.indexOf(lastChatWithActionItems) + 1;
    const prevChatWithActionItems = reversedChats[prevChatIndex];

    const doc = {
      userId: user._id,
      lastChat: lastChatWithActionItems ? {
        summary: lastChatWithActionItems.summary.summary,
        actionItems: lastChatWithActionItems.summary.actionItems,
        frequencyOfFollowUp: lastChatWithActionItems.summary.frequencyOfFollowUp || null  // Make it optional
      } : null,
      prevChat: prevChatWithActionItems ? {
        summary: prevChatWithActionItems.summary.summary,
        actionItems: prevChatWithActionItems.summary.actionItems,
        frequencyOfFollowUp: prevChatWithActionItems.summary.frequencyOfFollowUp || null  // Make it optional
      } : null
    };

    console.log("Final MongoDB-like document created!");
    console.log(doc);
    return doc;

  } catch (error) {
    console.error('An error occurred:', error);
  }
}

async function processUserFollowUps(userId) {
  try {
    console.log('Processing follow-ups...');
    const userChats = await userChatHistory(userId);
    console.log("userChats:", userChats);

    const latestFrequencyOfFollowUp = userChats.lastChat ? userChats.lastChat.frequencyOfFollowUp : null;
    
    console.log("latestFrequencyOfFollowUp:", latestFrequencyOfFollowUp);

    const aiResponse = await getFollowUpsOpenAIResponse(userChats);
    console.log("aiResponse:", aiResponse); 

    await sendSms(userId, aiResponse);

  } catch (error) {
    console.error("An error occurred:", error);
  }
}; 

module.exports = { userChatHistory, processUserFollowUps };