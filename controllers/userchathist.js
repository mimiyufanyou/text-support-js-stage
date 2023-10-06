const User = require('../models/user');

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
    const lastChatWithActionItems = reversedChats.find(chat => chat.summary.actionItems && chat.summary.actionItems.length > 0);
    const prevChatIndex = reversedChats.indexOf(lastChatWithActionItems) + 1;
    const prevChatWithActionItems = reversedChats[prevChatIndex];

    const doc = {
      userId: user._id,
      lastChat: lastChatWithActionItems ? {
        summary: lastChatWithActionItems.summary.summary,
        actionItems: lastChatWithActionItems.summary.actionItems,
        followUpFrequency: lastChatWithActionItems.summary.followUpFrequency || null  // Make it optional
      } : null,
      prevChat: prevChatWithActionItems ? {
        summary: prevChatWithActionItems.summary.summary,
        actionItems: prevChatWithActionItems.summary.actionItems,
        followUpFrequency: prevChatWithActionItems.summary.followUpFrequency || null  // Make it optional
      } : null
    };

    console.log("Final MongoDB-like document created!");
    console.log(doc);
    return doc;

  } catch (error) {
    console.error('An error occurred:', error);
  }
}

module.exports = { userChatHistory };