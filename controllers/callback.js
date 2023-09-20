// controllers/callback.js

const axios = require('axios');

const { sendSmsMessage } = require('./message');
const { createUser, getUserByPhoneNumber, updateUserChatAndSettings } = require('./user');

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

        // If user doesn't exist in our database
        if (!user) {
            if (['enneagram', 'stress'].includes(messagePayload.content.toLowerCase())) {
                // Check if the user has already taken this quiz
                const quizName = messagePayload.content.toLowerCase();
                const quizResult = await getQuizResultByUserId(number, quizName);

                if (quizResult) {
                    // User has already taken the quiz
                    await sendSmsMessage(number, "You have already taken this quiz.");
                    res.sendStatus(200);
                    return;
                }

                const loadedQuestions = loadQuizFromFile(quizName);
                if (!loadedQuestions) {
                    console.error("Quiz questions not loaded.");
                    await sendSmsMessage(number, "Sorry, couldn't load the quiz questions.");
                    res.sendStatus(200);
                    return;
                }

                user = await createUser({
                    phoneNumber: number,
                    chatHistory: [],
                    systemSettings: [{
                        context: quizName, // <-- Store the quiz name for reference
                        state: "NOT_STARTED",
                        answers: [],
                        currentQuestion: "q1"
                    }]
                });
            } else {
                // Ask the user which quiz they're interested in
                await sendSmsMessage(number, "Which quiz are you interested in (enneagram/stress)?");
                res.sendStatus(200);
                return;
            }
        }

        // By this point, the user either selected a quiz or is already in the middle of one
        const quizName = user.systemSettings[0].context;  // Extracting the quiz name
        const loadedQuestions = loadQuizFromFile(quizName);

        // Ensure the questions are loaded
        if (!loadedQuestions) {
            console.error("Quiz questions not loaded.");
            res.status(500).send("Failed to process the message");
            return;
        }

        const currentQuestionId = user.systemSettings[0].currentQuestion;
        const currentQuestion = loadedQuestions[currentQuestionId];

        if (!currentQuestion) {
            // If currentQuestion doesn't exist, default to OpenAI response
            content = await getOpenAIResponse(messagePayload.content);
        } else if (user.systemSettings[0].state === "NOT_STARTED" || user.systemSettings[0].state === "IN_PROGRESS") {
            const chosenOption = currentQuestion.options.find(opt => opt.id === messagePayload.content);

            if (chosenOption && chosenOption.result) {
                content = chosenOption.result;
                user.systemSettings[0].state = "COMPLETED";
                user.systemSettings[0].answers.push({ questionId: currentQuestionId, answer: chosenOption.text });
            } else if (chosenOption && chosenOption.next) {
                content = loadedQuestions[chosenOption.next].message;
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
            content = await getOpenAIResponse(messagePayload.content);

            // Just updating the chat history
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