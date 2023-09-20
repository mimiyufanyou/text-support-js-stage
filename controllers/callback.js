// controllers/callback.js

const axios = require('axios');

const { sendSmsMessage } = require('./message');
const { createUser, getUserByPhoneNumber, updateUserChatAndSettings } = require('./user');
const questions = require('../config/questions.json'); 

const handleSmsStatusCallback = (req, res) => {
    // Handle the status update here
    const statusUpdate = req.body;
    console.log('Received SMS status update:', statusUpdate);
  
    // Respond with a 200 OK to acknowledge receipt
    res.sendStatus(200);
  };

  const receiveSmsController = async (req, res) => {
    const messagePayload = req.body;
    const number = messagePayload.number;

    try {
        let user = await getUserByPhoneNumber(number);

        if (!user) {
            user = await createUser({
                phoneNumber: number,
                chatHistory: [],
                systemSettings: [{
                    context: "quiz",  // Setting context to "quiz" for new users
                    state: "NOT_STARTED",
                    answers: [],
                    currentQuestion: "q1"
                }]
            });
        }

        let content;

        const currentQuestionId = user.systemSettings[0].currentQuestion;
        const currentQuestion = questions[currentQuestionId]; // Make sure to access your questions correctly

        if (user.systemSettings[0].context === "quiz" && (user.systemSettings[0].state === "NOT_STARTED" || user.systemSettings[0].state === "IN_PROGRESS")) {
            const chosenOption = currentQuestion.options.find(opt => opt.id === messagePayload.content);

            if (chosenOption && chosenOption.result) {
                content = chosenOption.result;
                user.systemSettings[0].state = "COMPLETED";
                user.systemSettings[0].answers.push({ questionId: currentQuestionId, answer: chosenOption.text });
            } else if (chosenOption && chosenOption.next) {
                content = questions[chosenOption.next].message; // Provide the next question's message
                user.systemSettings[0].currentQuestion = chosenOption.next;
                user.systemSettings[0].answers.push({ questionId: currentQuestionId, answer: chosenOption.text });
            } else {
                content = "Invalid option. Please try again. " + currentQuestion.message; // Prompt them to answer the current question again
            }
            
            await updateUserChatAndSettings(number, {
                role: "user",
                content: messagePayload.content,
                timestamp: new Date()
            }, user.systemSettings[0]);

        } else if (user.systemSettings[0].context === "quiz" && user.systemSettings[0].state === "COMPLETED") {
            content = "You have already completed the quiz. Type 'RESTART' if you want to start over."; 
        } else {
            // Handle other conversation context
            content = await getOpenAIResponse(messagePayload.content);
            await updateUserChatAndSettings(number, {
                role: "user",
                content: messagePayload.content,
                timestamp: new Date()
            }, user.systemSettings[0]);
        }

        await sendSmsMessage(number, content);
        res.sendStatus(200);
    } catch (error) {
        console.error("Error processing SMS:", error);
        res.status(500).send("Failed to process the message");
    }
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
}

module.exports = {
  handleSmsStatusCallback,
  receiveSmsController,
};