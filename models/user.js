const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true,
        unique: true
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
    systemSettings: {
        // You can extend this with any settings you want to store
        context: {
            type: String,
            default: ""
        }
    }
});

module.exports = mongoose.model('User', userSchema);