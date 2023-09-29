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
  content: {
    type: String,
    required: false
  },
  type: {
    type: String,
    required: false
  },
  was_downgraded: {  // Was the message downgraded to SMS?
    type: Boolean,
    required: false
  },
  status: { 
    type: String,
    required: false
  },
  vectorChecks: {
    type: [],
    required: false
  }, 
  transitionTrigger: {
    type: String,
    required: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Create the model
module.exports = mongoose.model('NewMessage', messageSchema);