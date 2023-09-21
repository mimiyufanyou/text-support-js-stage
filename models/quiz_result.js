const mongoose = require('mongoose');

// Define the quiz result schema

const quizResultSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
    }, 
    answers: [{
        questionId: String,
        selectedOption: String
    }],
    result: {
        type: String,
        required: true
    },
    // Add other fields as necessary
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Add a pre-save hook to update the "updatedAt" field
quizResultSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create the models
const QuizResult = mongoose.model('QuizResult', quizResultSchema);

// Export the models
module.exports = {
  QuizResult
};