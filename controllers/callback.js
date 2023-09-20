// controllers/callback.js

const axios = require('axios');

const { sendSmsMessage } = require('./message');
const { createUser, getUserByPhoneNumber, updateUserChatAndSettings } = require('./user');
const { getQuizResultByUserId, loadQuizFromFile } = require('./quiz');
const { askIfTakenQuiz, checkQuizCompletionForUser, startQuiz, initializeQuiz } = require('./quizdelivery');

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

const updateUserProgress = async (user, questionId) => {
    try {
        user.currentQuestionId = questionId;
        await user.save();
    } catch (err) {
        console.error('Error updating user progress:', err);
    }
};

const askQuestion = async (number, questionId, questionsData) => {
    const specificQuestion = questionsData.questions.find(q => q.id === questionId);

    if (!specificQuestion) {
        console.log("All questions answered or invalid question ID.");
        await sendSmsMessage(number, "Thank you for participating in the quiz!");
        return;
    }

    let questionText = specificQuestion.text;
    specificQuestion.options.forEach((option, index) => {
        questionText += `\n${index + 1}. ${option.text}`;
    });

    await sendSmsMessage(number, questionText);
};

const receiveSmsController = async (req, res) => {
    try {
        const { number, message } = req.body;
        const user = await getUserByPhoneNumber(number);

        if (!user) {
            console.error("User not found for number:", number);
            await sendSmsMessage(number, "Sorry, we couldn't identify you.");
            res.sendStatus(200);
            return;
        }

        const quizCompleted = await checkQuizCompletionForUser(user);
        if (quizCompleted) {
            await sendSmsMessage(number, "You've already completed this quiz.");
            res.sendStatus(200);
            return;
        }

        const quizName = user.systemSettings[0].context || "enneagram";
        const loadedQuestions = loadQuizFromFile(quizName);

        if (!loadedQuestions) {
            console.error('Error loading questions for quiz:', quizName);
            await sendSmsMessage(number, "Sorry, couldn't load the quiz questions.");
            res.sendStatus(200);
            return;
        }

        if (!user.currentQuestionId) {
            await askQuestion(number, 'q1', loadedQuestions);
        } else {
            const chosenIndex = parseInt(message) - 1;
            const previousQuestion = loadedQuestions.questions.find(q => q.id === user.currentQuestionId);
            const chosenOption = previousQuestion && previousQuestion.options[chosenIndex];

            if (chosenOption && chosenOption.next) {
                await askQuestion(number, chosenOption.next, loadedQuestions);
            } else if (chosenOption && chosenOption.result) {
                await sendSmsMessage(number, `Your result is: ${chosenOption.result}`);
                await createQuizResult({
                    user,
                    quizName: loadedQuestions.name,
                    result: chosenOption.result,
                    answers: []  // Assuming you might want to save answers in the future
                });
            } else {
                await sendSmsMessage(number, "Invalid option. Please try again.");
                await askQuestion(number, user.currentQuestionId, loadedQuestions);
            }
        }

        res.sendStatus(200);

    } catch (err) {
        console.error('Error in receiveSmsController:', err);
        res.sendStatus(500);  // Sending 500 for unexpected server errors
    }
};

module.exports = {
  handleSmsStatusCallback,
  receiveSmsController,
};