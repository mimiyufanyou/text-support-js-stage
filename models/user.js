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
        required: true, 
        unique: true 
    },
    confirmed: Boolean, 
    email: {
      type: String,
      required: false,
      unique: true
    },
    programs: [{
      programId: String,
    }],
    quizResults: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'QuizResult'
    }],
    chatHistory: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChatHistory'
    }],
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




