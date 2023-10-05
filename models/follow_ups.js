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
  PostSessionObject: { 
    type: Object,
    required: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });