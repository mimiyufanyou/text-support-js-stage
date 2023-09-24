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

const quizSequence = ['onboarding', 'thought_starters', 'stress'];

const receiveSmsController = async (req, res) => {
  try {
    await receiveSmsMessage(req, 'user');
    const messagePayload = req.body;
    const number = messagePayload.number;
    const user = await User.findOne({ phoneNumber: number });

    let content;
    let type;

    const lastMessage = await Message.findOne({ 
      phoneNumber: number, 
      type: { $ne: 'user' }  // $ne is the 'not equals' operator in MongoDB
    }).sort({ createdAt: -1 });

    if (!lastMessage) {
      // If there's no last message, start with the first quiz in the sequence
      const currentQuiz = await Quiz.findOne({ name: quizSequence[0] });
      content = currentQuiz.questions[0].text;
      type = quizSequence[0];
    } else {
      // Find which quiz the last message belonged to
      const lastQuizIndex = quizSequence.indexOf(lastMessage.type);

      if (lastQuizIndex >= 0) {
        const currentQuiz = await Quiz.findOne({ name: quizSequence[lastQuizIndex] });
        const lastQuestionIndex = currentQuiz.questions.findIndex(q => q.text === lastMessage.content);
        const nextQuestion = currentQuiz.questions[lastQuestionIndex + 1];

        if (nextQuestion) {
          // Continue with the current quiz
          content = nextQuestion.text;
          type = quizSequence[lastQuizIndex];
        } else {
          // Proceed to the next quiz in the sequence
          const nextQuiz = quizSequence[lastQuizIndex + 1];
          if (nextQuiz) {
            const newQuiz = await Quiz.findOne({ name: nextQuiz });
            content = newQuiz.questions[0].text;
            type = nextQuiz;
          } else {
            // Handle OpenAI response only if onboarding is done
            content = await getOpenAIResponse(messagePayload.content);
            type = 'openai';
            await processAndStoreMessage(user, number, content, type);
          }
        }
      } else {
        content = await getOpenAIResponse(messagePayload.content);
        type = 'openai';
      }
    }

    await processAndStoreMessage(user, number, content, type);

    // Send SMS and respond
    await sendSmsMessage(number, content);
    res.sendStatus(200);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Failed to process the message");
  }
};


module.exports = {
  handleSmsStatusCallback,
  receiveSmsController,
};