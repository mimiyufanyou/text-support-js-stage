const User = require('../models/user');
const ChatHistory = require('../models/chat_history');

async function associateChatHistories() {
  try {
    const allChats = await ChatHistory.find().lean().exec();

    for (const chat of allChats) {
      // Find the corresponding user based on userId
      const user = await User.findById(chat.userId).exec();
      console.log("Found user:", user._id)

      if (user) {
        // Assuming chatHistory is an array field in the User model
        user.chatHistory.push(chat._id);
        await user.save();
        console.log("Associated chat history with user:", user._id);
      }
    }
    console.log("Successfully associated all chat histories.");
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

module.exports = { associateChatHistories }; 