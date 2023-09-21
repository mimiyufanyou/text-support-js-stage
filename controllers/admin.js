const QuizResult = require('../models/quiz_result');

const fs = require('fs');
const path = require('path');

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

const loadQuizFromFile = (quizName) => {
    const folderPath = path.join(__dirname,'.', 'config', 'questionnaires');  
    const filePath = path.join(folderPath, `${quizName}_quiz.json`);

    if (fs.existsSync(filePath)) {
        questionsData = require(filePath);
        // console.log(questionsData)
        return questionsData;
    } else {
        console.log(`No quiz named ${quizName} found at path ${filePath}.`);
        return false;
    }
};

const getQuizResultByUserId = async (phoneNumber, quizName) => {
    try {
        const result = await QuizResult.findOne({ phoneNumber, quizName });
        return result;
    } catch (error) {
        throw error;
    }
};

const createQuizResult = async (data) => {
    try {
        console.log("Attempting to save the following data:", data);
        const quizResult = new QuizResult(data);
        const savedResult = await quizResult.save();
        console.log("Saved result:", savedResult);
        return savedResult;
    } catch (error) {
        console.error("Error saving quiz result:", error);
        throw error;
    }
};

const quizController = async (req, res) => {
    try {
        const messagePayload = req.body;
        const number = messagePayload.number;
        const userId = number;  // Assuming the number is used as userId

        // Fetch quiz result for the user
        let quizResult = await getQuizResultByUserId(userId);
        console.log("User's Quiz Results:", quizResult?.results);

        const quizNames = ['enneagram', 'stress']; // List of quiz names

        if (!quizResult) {
            quizResult = {
                userId: userId,
                results: []
            };

            for (const quizName of quizNames) {
                const hasQuizResult = quizResult.results.some(result => result.quizName === quizName);

                if (!hasQuizResult) {
                    // If no result found for the quiz, initialize a new entry
                    quizResult.results.push({
                        quizName: quizName,
                        result: [],
                    });
                }
            }

            await createQuizResult(quizResult);
        }

        // Send a success response (or do any other operations needed)
        res.status(200).send("Processed successfully");
        
    } catch (error) {
        console.error("Error processing SMS or fetching/initializing quiz results:", error);
        res.status(500).send("Failed to process the message");
    }
};

module.exports = {
    createQuizResult, 
    getQuizResultByUserId, 
    quizController, 
    loadQuizFromFile
};