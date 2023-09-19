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
        console.log("User's Current Settings:", user?.systemSettings);

        if (!user) {
            user = await createUser({
                phoneNumber: number,
                chatHistory: [],
                systemSettings: [{
                    context: "",
                    state: "NOT_STARTED",
                    answers: [],
                    currentQuestion: "q1"
                }]
            });
        }

        let content;
        const currentQuestionId = user.systemSettings[0].currentQuestion;
        const currentQuestion = questions[currentQuestionId];

        if (!currentQuestion) {
            // If currentQuestion doesn't exist, default to OpenAI response
            content = await getOpenAIResponse(messagePayload.content);
        } else if (user.systemSettings[0].state === "NOT_STARTED" || user.systemSettings[0].state === "IN_PROGRESS") {
            const chosenOption = currentQuestion.options.find(opt => opt.id === messagePayload.content);
            
            if (chosenOption && chosenOption.result) {
                // If the option leads to a result
                content = chosenOption.result;
                user.systemSettings[0].state = "COMPLETED";
                user.systemSettings[0].answers.push({ questionId: currentQuestionId, answer: chosenOption.text });
            } else if (chosenOption && chosenOption.next) {
                // If the option leads to another question
                content = questions[chosenOption.next].message;
                user.systemSettings[0].currentQuestion = chosenOption.next;
                user.systemSettings[0].answers.push({ questionId: currentQuestionId, answer: chosenOption.text });
            } else {
                // Invalid answer, prompt the user again with the same question
                content = currentQuestion.message;
            }
            
            // Update chat and system settings
            await updateUserChatAndSettings(number, {
                role: "user",
                content: messagePayload.content,
                timestamp: new Date()
            }, user.systemSettings[0]);

        } else {
            // User has finished all questions or provided an invalid option, process their message normally
            content = await getOpenAIResponse(messagePayload.content);

            // Since the user might have finished the questions, we're just updating the chat history
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