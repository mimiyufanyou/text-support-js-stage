const fs = require('fs');
const path = require('path');
const { connect } = require('../config/db');  // Importing your connection function

const { getQuizResultByUserId, createQuizResult, quizController, loadQuizFromFile } = require('./quiz');

const checkQuizCompletionForUser = async (user, quizName) => {
    const quizResult = await getQuizResultByUserId(user, quizName);
    return !!quizResult;  // Returns true if a quiz result exists, otherwise false
};

const askIfTakenQuiz = async (user, quizName) => {
    const hasTakenQuiz = await checkQuizCompletionForUser(user, quizName);

    if (!hasTakenQuiz) {
        rl.question(`Have you taken the ${quizName} test? (yes/no) `, (answer) => {
            if (answer.toLowerCase() === 'no') {
                const isQuizLoaded = loadQuizFromFile(quizName);

                if (isQuizLoaded) {
                    console.log(`Starting the ${quizName} quiz...`);
                    askQuestion('q1', isQuizLoaded);  // Assuming you're now passing the quiz data to `askQuestion`
                } else {
                    console.log(`No quiz named ${quizName} found.`);
                    rl.close();
                }
            } else {
                console.log(`Okay! Let me know if you'd like to take another quiz.`);
                rl.close();
            }
        });
    } else {
        console.log("You have already taken this quiz.");
        rl.close();
    }
};

const askQuestion = (questionId, questionsData) => {
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

// This function will initialize the application
const initializeQuiz = async () => {
    try {
        // First, connect to the database
        await connect();

        // Then, start the readline interface
        rl.question("Which quiz are you interested in (enneagram/stress)? ", async (quizChoice) => {
            if (['enneagram', 'stress'].includes(quizChoice.toLowerCase())) {
                await askIfTakenQuiz(user, quizChoice.toLowerCase());  // Call `askIfTakenQuiz` instead of `startQuiz`
            } else {
                console.log("I'm sorry, I didn't understand which quiz you want. Please specify either 'enneagram' or 'stress'.");
                rl.close();
            }
        });

    } catch (err) {
        console.error("Error connecting to the database:", err);
    }
};

module.exports = { 
    checkQuizCompletionForUser, 
    askIfTakenQuiz, 
    askQuestion, 
    startQuiz, 
    initializeQuiz 
};
