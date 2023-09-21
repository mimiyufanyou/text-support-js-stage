const mongoose = require('mongoose');

const optionsSchema = new mongoose.Schema({
  id: Number,
  number: Number,
  text: String,
  next: Number
});

// Define the quiz schema
const quizSchema = new mongoose.Schema({
    quizId: String,
    name: String, 
    title: String,
    description: String,
    questions: [{
      id: Number,
      questionText: String,
      options: optionsSchema 
    }]
  });

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;