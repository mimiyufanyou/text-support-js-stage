// controllers/callback.js
const { sendSmsMessage, receiveSmsMessage, processAndStoreMessage  } = require('./message');
const { getOpenAIResponse } = require('./openai');

const User = require('../models/user');
const Quiz = require('../models/quiz');

// Update SendBlue on status of message 
const handleSmsStatusCallback = (req, res) => {
    try {
        const statusUpdate = req.body;
        console.log('Received SMS status update:', statusUpdate);
  
        res.sendStatus(200);
    } catch (err) {
        console.error('Error handling SMS status callback:', err);
        res.sendStatus(500);
    }
};

const receiveSmsController = async (req, res) => {
  try {
    await receiveSmsMessage(req, res);
    const messagePayload = req.body;
    console.log("Message Payload:", messagePayload);


    const number = messagePayload.number;
    let user = await User.findOne({ phoneNumber: number });
    let content;

    if (!user.quizResults) {
      console.log("No quiz results found for user:", number);
      let currentQuiz = await Quiz.findOne({ name: 'thought_starters' });

      const questions = currentQuiz.questions;
      console.log("Current quiz:", currentQuiz.name);

      for (const [index, question] of questions.entries()) {
        console.log(`Question ${index + 1}: ${question.text}`);
        content = question.text;
        let type = 'quiz';
        await processAndStoreMessage(user, number, content, type)    
    };

    } else {
      content = await getOpenAIResponse(content);
      let type = 'openai';
      await processAndStoreMessage(user, number, content, type) 
    }
    await sendSmsMessage(number, content);
    res.sendStatus(200);

  } catch (error) {
    console.error("Error getting OpenAI response:", error);
    res.status(500).send("Failed to process the message");
  }
};

module.exports = {
  handleSmsStatusCallback,
  receiveSmsController,
};