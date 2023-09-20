// controllers/callback.js

const axios = require('axios');

const { sendSmsMessage } = require('./message');
const { createUser, getUserByPhoneNumber, updateUserChatAndSettings } = require('./user');
const { getQuizResultByUserId, loadQuizFromFile } = require('./quiz');

const handleSmsStatusCallback = (req, res) => {
    // Handle the status update here
    const statusUpdate = req.body;
    console.log('Received SMS status update:', statusUpdate);
  
    // Respond with a 200 OK to acknowledge receipt
    res.sendStatus(200);
  };

const askQuestion = async (number, questionId, questionsData, user) => {
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

const updateUserProgress = async (user, questionId) => {
    // Logic to update user's currentQuestionId in the database
    user.currentQuestionId = questionId;
    await user.save(); // This is a generic method, replace it with whatever your DB uses
};

const receiveSmsController = async (req, res) => {
    const { number, message } = req.body;
    
    const user = await getUserByNumber(number);
    
    if (!user) {
        console.error("User not found");
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

    const quizName = user.systemSettings[0].context || "default_quiz"; // Replace 'default_quiz' with the actual name
    const loadedQuestions = loadQuizFromFile(quizName);
    
    if (!loadedQuestions) {
        await sendSmsMessage(number, "Sorry, couldn't load the quiz questions.");
        res.sendStatus(200);
        return;
    }
    
    if (!user.currentQuestionId) {
        await askQuestion(number, 'q1', loadedQuestions, user);
        await updateUserProgress(user, 'q1');
    } else {
        const chosenIndex = parseInt(message) - 1;
        const previousQuestion = loadedQuestions.questions.find(q => q.id === user.currentQuestionId);
        const chosenOption = previousQuestion.options[chosenIndex];

        if (chosenOption && chosenOption.next) {
            await askQuestion(number, chosenOption.next, loadedQuestions, user);
            await updateUserProgress(user, chosenOption.next);
        } else if (chosenOption && chosenOption.result) {
            await sendSmsMessage(number, `Your result is: ${chosenOption.result}`);
            await createQuizResult({
                user,
                quizName: loadedQuestions.name,
                result: chosenOption.result,
                answers: []  
            });
        } else {
            await sendSmsMessage(number, "Invalid option. Please try again.");
            await askQuestion(number, user.currentQuestionId, loadedQuestions, user); // No need to update the progress here as it's a repeated question
        }
    }

    res.sendStatus(200);
};

async function getOpenAIResponse(message) {
    const endpoint = "https://api.openai.com/v1/chat/completions";

    const data = {
        messages: [{ "role": "user", "content": message }],
        max_tokens: 150,
        model: "gpt-3.5-turbo",
    };

    const headers = {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.post(endpoint, data, { headers: headers });
        
        return response.data.choices[0].message.content;

    } catch (error) {
        console.error("Error querying OpenAI:", error);
        throw new Error("Sorry, I couldn't process that.");
    }
};

module.exports = {
  handleSmsStatusCallback,
  receiveSmsController,
};