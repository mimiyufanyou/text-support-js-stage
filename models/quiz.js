// models/QuizResult.js

const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
    // Define your schema here, for example:
    quizName: {
        type: String,
        required: true
    },
    result: {
        type: String,
        required: true
    },
    // Add other fields as necessary
});

module.exports = mongoose.model('QuizResult', quizResultSchema);