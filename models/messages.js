// models/messages.js 

const mongoose = require('mongoose');

// Define message schema
const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: false
  },
  content: {
    type: String,
    required: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Create the model
module.exports = mongoose.model('NewMessage', messageSchema);