// models/user.js 

const mongoose = require('mongoose');

const { chatHistorySchema } = require('./chat_history');
const { contextSchema } = require('./context'); 
const { quizResultSchema } = require('./quiz_result');


const userSchema = new mongoose.Schema({
    userId: {
      type: String,
      required: true,
      unique: true
    },
    username: String,
    phoneNumber: {
        type: String,
        required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    programs: [{
      programId: String,
    }],
    quizResults: [quizResultSchema],
    chatHistory: [chatHistorySchema],
    userContext: [contextSchema], 
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  });

module.exports = mongoose.model('User', userSchema);




