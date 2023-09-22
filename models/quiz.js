const mongoose = require('mongoose');

const optionsSchema = new mongoose.Schema({
  id: Number,
  number: Number,
  text: String,
  next: Number
});

// Define the quiz schema
const quizSchema = new mongoose.Schema({
    name: String, 
    questions: [{
      id: Number,
      text: String,
      options: optionsSchema 
    }]
  });

const Quiz = mongoose.model('Quiz', quizSchema, 'quiz');

module.exports = Quiz;