// models/user.js 

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true, 
        unique: true 
    },
    confirmed: Boolean, 
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
    userContext: { 
      type: Array, 
      default: []
    }, 
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }, { timestamps: true });

module.exports = mongoose.model('User', userSchema);




