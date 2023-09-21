const fs = require('fs');
const path = require('path');
const { connect } = require('../config/db');  // Importing your connection function

const { getQuizResultByUserId, createQuizResult, quizController, loadQuizFromFile } = require('./admin');


// This function will start the quiz after checking for the quiz data
const startQuiz = async (quizName) => {
    const questionsData = loadQuizFromFile(quizName);

    if (questionsData) {
        console.log(`Starting the ${quizName} quiz...`);
        await askQuestion('q1', questionsData);  // Pass the loaded data to the function
    } else {
        console.log(`No quiz named ${quizName} found.`);
        rl.close();
    }
};


// Conclude Quiz 
const concludeQuiz = async (user, quizName) => {
    const quizResult = await getQuizResultByUserId(user, quizName);
    return !!quizResult;  // Returns true if a quiz result exists, otherwise false
};

// Get Next Question 
const getNextQuestion = async (user, quizName) => {

}  

const askQuestion = async (user, questionsData) => {
    try {
        // Check for potential issues with input data
        if (!user || !user.systemSettings || !user.systemSettings[0] || typeof user.systemSettings[0].currentQuestion !== 'number') {
            throw new Error('Invalid user data provided.');
        }

        const specificQuestion = questionsData.questions.find(q => q.id === user.systemSettings[0].currentQuestion);

        if (!specificQuestion) {
            console.log("All questions answered or invalid question ID.");
            await sendSmsMessage(user.phoneNumber, "Thank you for participating in the quiz!"); // revisit this later 
            return;
        }

        let questionText = specificQuestion.text;
        specificQuestion.options.forEach((option, index) => {
            questionText += `\n${index + 1}. ${option.text}`;
        });

        await sendSmsMessage(user.phoneNumber, questionText);

    } catch (error) {
        console.error('Error in askQuestion function:', error.message);
        // Optionally, you can send an error message to the user, informing them of the issue
        await sendSmsMessage(user.phoneNumber, "Sorry, there was an error processing your request.");
    }
};

const chooseQuizIndex = (questionId, questionsData) => {
    const specificQuestion = questionsData.questions.find(q => q.id === questionId);

    if (!specificQuestion) {
        console.log("All questions answered or invalid question ID.");
        rl.close();
        return;
    }

    console.log(specificQuestion.text);

    specificQuestion.options.forEach((option, index) => {
        console.log(`${index + 1}. ${option.text}`);
    });

    rl.question("Please select an option number: ", async (answer) => {
        const chosenIndex = parseInt(answer) - 1;
        const chosenOption = specificQuestion.options[chosenIndex];

        if (chosenOption && chosenOption.next) {
            askQuestion(chosenOption.next, questionsData);
        } else if (chosenOption && chosenOption.result) {
            console.log(`Your result is: ${chosenOption.result}`);
            await createQuizResult({
                user,
                quizName: questionsData.name,
                result: chosenOption.result,
                answers: []  // Assuming you might want to save answers in the future
            });
            rl.close();
        } else {
            console.log("Invalid option. Please try again.");
            askQuestion(questionId, questionsData); // Add questionsData here
        }
    });
};

module.exports = { 
    checkQuizCompletionForUser, 
    askIfTakenQuiz, 
    askQuestion, 
    startQuiz,
};



/// this is junk from callback.js 


// find the question that user is on, send a message what the fuck? 
// let the questiontext be for the current question and then send that question text with all the options 

/* 
const askQuestion = async (user, questionsData) => {
    const specificQuestion = questionsData.questions.find(q => q.id === questionId);

    if (!specificQuestion) {
        console.log("All questions answered or invalid question ID.");
        await sendSmsMessage(user.phoneNumber, "Thank you for participating in the quiz!"); // revisit this later 
        return;
    }

    let questionText = specificQuestion.text;
    specificQuestion.options.forEach((option, index) => {
        questionText += `\n${index + 1}. ${option.text}`;
    });

    await sendSmsMessage(user.phoneNumber, questionText);

    // Update the user's progress for the next time
    try {
        user.currentQuestionId++;
        await user.save();
    } catch (err) {
        console.error('Error updating user progress:', err);
    }
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

// 
*/ 