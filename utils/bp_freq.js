const { connect } = require('../config/db');
require('dotenv').config();
const ChatHistory = require('../models/chat_history');

// Migration function
async function migrateChatHistories() {
  try {
    // Connect to the database
    await connect();
    console.log('Connected to MongoDB');

    // Fetch all chat histories that don't have the frequencyOfFollowUp field
    const chatHistories = await ChatHistory.find({
      'summary.frequencyOfFollowUp': { $exists: false }
    }).exec();

    // Loop through each chat history and update it
    for (const chat of chatHistories) {
      chat.summary = {
        ...chat.summary,
        frequencyOfFollowUp: 'None'  // Set the default value to 'None'
      };
      await chat.save();
    }

    console.log(`Migration complete. Updated ${chatHistories.length} chat histories.`);
  } catch (err) {
    console.error('Migration failed:', err);
  }
}

// Run the migration
migrateChatHistories();