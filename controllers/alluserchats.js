const User = require('../models/user');

async function usersandChats() {
  try {
    console.log("Fetching users and their chat histories...");
    const users = await User.find()
      .populate({
        path: 'chatHistory',
        populate: { path: 'summary' }
      })
      .lean()
      .exec();
    console.log("Fetched users successfully!");

    const chatHistoryDocs = users.map((user, userIndex) => {
      console.log(`Processing user ${userIndex + 1} with ID: ${user._id}`);
      
      const reversedChats = [...user.chatHistory].reverse();
      const lastChatWithActionItems = reversedChats.find(chat => chat.summary.actionItems && chat.summary.actionItems.length > 0);
      const prevChatIndex = reversedChats.indexOf(lastChatWithActionItems) + 1;
      const prevChatWithActionItems = reversedChats[prevChatIndex];

      const doc = {
        userId: user._id,
        lastChat: lastChatWithActionItems ? {
          summary: lastChatWithActionItems.summary.summary,
          actionItems: lastChatWithActionItems.summary.actionItems
        } : null,
        prevChat: prevChatWithActionItems ? {
          summary: prevChatWithActionItems.summary.summary,
          actionItems: prevChatWithActionItems.summary.actionItems
        } : null
      };

      return doc;
    });

    console.log("Final MongoDB-like documents created!");
    console.log(chatHistoryDocs);
    return chatHistoryDocs;

  } catch (error) {
    console.error('An error occurred:', error);
  }
}

module.exports = { usersandChats };
