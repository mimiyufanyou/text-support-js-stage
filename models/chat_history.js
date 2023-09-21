const mongoose = require('mongoose');

// Define the chat session schema
const chatHistorySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  conversationId: {
    type: String,
    required: true,
    unique: true
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  topic: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  keyTakeaways: [{
    type: String
  }],
  actionItems: [{
    description: String,
    deadline: Date,
    assignedTo: String
  }],
  quotesOfNote: [{
    quote: String,
    speaker: String
  }]
});

// Create the model
const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);

module.exports = ChatHistory;