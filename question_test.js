const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { connect } = require('./config/db');  // Importing your connection function

const { getQuizResultByUserId, createQuizResult, quizController, loadQuizFromFile } = require('./controllers/quiz');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const user = '+16048189821'

let questionsData;  // Declare the variable at the module level

const askIfTakenQuiz = async (quizName) => {
    const quizResult = await getQuizResultByUserId(user, quizName);

    if (!quizResult) {
        rl.question(`Have you taken the ${quizName} test? (yes/no) `, (answer) => {
            if (answer.toLowerCase() === 'no') {
                const isQuizLoaded = loadQuizFromFile(quizName);

                if (isQuizLoaded) {
                    console.log(`Starting the ${quizName} quiz...`);
                    askQuestion('q1');
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
                await startQuiz(quizChoice.toLowerCase());  // Call the renamed function here
            } else {
                console.log("I'm sorry, I didn't understand which quiz you want. Please specify either 'enneagram' or 'stress'.");
                rl.close();
            }
        });

    } catch (err) {
        console.error("Error connecting to the database:", err);
    }
};

initializeQuiz();  // Call the main function to start your program

