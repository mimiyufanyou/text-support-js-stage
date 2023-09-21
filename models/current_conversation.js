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
  phoneNumber: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  messages: [messageSchema],
  topic: {
    type: String,
    default: "", 
    nullable: true 
  }, 
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
const NewMessage = mongoose.model('NewMessage', messageSchema);

module.exports = {
  CurrentConversation, 
  NewMessage, 
};