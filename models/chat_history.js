const mongoose = require('mongoose');

// Define the chat session schema
const chatHistorySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  sessionId: {
    type: String,
    required: true
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  topic: {
    type: String
  },
  summary: {
    type: String
  },
  keyTakeaways: [],
  actionItems: [],
  quotesOfNote: []
}, { timestamps: true });

// Create the model
const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);

module.exports = ChatHistory;