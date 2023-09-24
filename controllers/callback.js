// controllers/callback.js
const { sendSmsMessage, receiveSmsMessage, processAndStoreMessage  } = require('./message');
const { getOpenAIResponse } = require('./openai');

const User = require('../models/user');
const Quiz = require('../models/quiz');
const Message = require('../models/messages');

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
    // Receive SMS and fetch user data
    await receiveSmsMessage(req, 'user');
    const messagePayload = req.body;
    // console.log("Message Payload:", messagePayload);

    const number = messagePayload.number;
    let user = await User.findOne({ phoneNumber: number });
    let history = await Message.find({ phoneNumber: number}); 
    let content;
    let type;

    console.log("History:", history)

    const hasTypeQuiz = history.some(message => message.type === 'thought_starters');
    const hasTypeOnboarding = history.some(message => message.type === 'onboarding');

    // Check if user has quiz results

    if (!hasTypeOnboarding) {
      let currentQuiz = await Quiz.findOne({ name: 'onboarding' });
      const questions = currentQuiz.questions;
      console.log("Current quiz:", currentQuiz.name);

      for (const [index, question] of questions.entries()) {
        console.log(`Question ${index + 1}: ${question.text}`);
        content = question.text;
        type = 'onboarding';
        await processAndStoreMessage(user, number, content, type);
      }

      if (!hasTypeQuiz) {
        console.log("No quiz results found for user:", number);
  
        // Fetch and process quiz
        let currentQuiz = await Quiz.findOne({ name: 'thought_starters' });
        const questions = currentQuiz.questions;
        console.log("Current quiz:", currentQuiz.name);
  
        for (const [index, question] of questions.entries()) {
          console.log(`Question ${index + 1}: ${question.text}`);
          content = question.text;
          type = 'thought_starters';
          await processAndStoreMessage(user, number, content, type);
        }
    } 

    } else {
      // Fetch and process OpenAI response
      content = await getOpenAIResponse(messagePayload.content);
      type = 'openai';
      await processAndStoreMessage(user, number, content, type);
    }

    // Send SMS and respond
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