
const QuizResult = require('../models/quiz');

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const loadQuizFromFile = (quizName) => {
    const folderPath = path.join(__dirname,'..', 'config', 'questionnaires');  
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

const getQuizResultByUserId = async (userId, quizName) => {
    try {
        const result = await QuizResult.findOne({ user: userId, quizName });
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