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
    await receiveSmsMessage(req, 'user');
    const messagePayload = req.body;
    console.log("Message Payload:", messagePayload);

    const number = messagePayload.number;
    const user = await User.findOne({ phoneNumber: number });

    // Check if the user has 'onboarding' type in their history
    const hasTypeOnboarding = await Message.exists({ user: user._id, type: 'onboarding' });
    
    // Check if the user has 'thought_starters' type in their history
    const hasTypeQuiz = await Message.exists({ user: user._id, type: 'thought_starters' });
  
    let content;
    let type;

    if (!hasTypeOnboarding) {
      // Handle onboarding
      const currentQuiz = await Quiz.findOne({ name: 'onboarding' });
      const questions = currentQuiz.questions;

      console.log("Current quiz:", currentQuiz.name);

      for (const [index, question] of questions.entries()) {
        console.log(`Question ${index + 1}: ${question.text}`);
        content = question.text;
        type = 'onboarding';
        await processAndStoreMessage(user, number, content, type);
      }
    } else if (!hasTypeQuiz) {
      // Handle thought starters only if onboarding is done
      console.log("No quiz results found for user:", number);

      const currentQuiz = await Quiz.findOne({ name: 'thought_starters' });
      const questions = currentQuiz.questions;

      console.log("Current quiz:", currentQuiz.name);

      for (const [index, question] of questions.entries()) {
        console.log(`Question ${index + 1}: ${question.text}`);
        content = question.text;
        type = 'thought_starters';
        await processAndStoreMessage(user, number, content, type);
      }
    } else {
      // Handle OpenAI response only if onboarding is done
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