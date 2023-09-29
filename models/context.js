const mongoose = require('mongoose');

// Define the schema
const userContextSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  lastInteractionTime: {
    type: Date,
    default: Date.now
  },
  preferences: {
    checkInFrequency: {
      type: String,  // or mongoose.Schema.Types.Mixed for more flexibility
      default: 'Only when I initiate contact'
    }
  },
  thought_starters: {
    type: String, 
    required: false 
  },
  communication_style: {
    type: String, 
    required: false 
  },
  pastConversations: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatHistory'  
  },
  customFields: mongoose.Schema.Types.Mixed  // for storing any additional user-specific information
}, { timestamps: true });

// Create the model
const UserContext = mongoose.model('UserContext', userContextSchema);

module.exports = UserContext;