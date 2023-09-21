const mongoose = require('mongoose');

// Define message schema
const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Define the current conversation schema
const currentConversationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  sessionId: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  messages: [messageSchema],
  topic: String,
  startedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Add a pre-save hook to update the "updatedAt" field
currentConversationSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create the model
const CurrentConversation = mongoose.model('CurrentConversation', currentConversationSchema);

module.exports = CurrentConversation;