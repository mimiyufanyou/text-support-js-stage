// models/User.js 

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true
    },
    chatHistory: [{
        role: {
            type: String,
            enum: ['user', 'assistant', 'system'],
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
    }],
    systemSettings: [{
        context: String,
        state: {
            type: String,
            enum: ["NOT_STARTED", "IN_PROGRESS", "COMPLETED"],
            default: "NOT_STARTED"
        },
        answers: [{
            questionId: String,
            answer: String
        }],
        currentQuestion: String
    }]
});

module.exports = mongoose.model('User', userSchema);