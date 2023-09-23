// models/messages.js 

const mongoose = require('mongoose');

// Define message schema
const messageSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Assuming 'User' is another model you've defined
    required: false
  },
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',  
    required: false
  },
  quizResponse: { 
    type: Boolean, 
    required: false
  }, 
  quizName: { 
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