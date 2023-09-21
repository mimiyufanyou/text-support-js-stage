const { connect } = require('./config/db');
const mongoose = require('mongoose');

/// test stuff 

const number = "+16048189821"
const quizName = "enneagram";

const User = require('./models/user');
const QuizResult = require('./models/quiz_result');

const fs = require('fs');
const path = require('path');
const { getUserByPhoneNumber } = require('./controllers/user');
const { sendSmsMessage } = require('./controllers/message');






// Connect and fetch user data
connect().then(async () => {

    const questionsData = await loadQuizFromFile(quizName);
    const user = await getUserByPhoneNumber(number); 
    console.log("Field:", user.systemSettings[0].currentQuestion)
    console.log("Questions Data:", questionsData.questions.find(q => q.id === user.systemSettings[0].currentQuestion));
    console.log("Questions Data:", questionsData.questions.find(q => q.id === 1));
    console.log("Pre stuff:", user);

    await askQuestion(user, questionsData);

    console.log("Post stuff:", user);

    await mongoose.disconnect(); // Close the connection after fetching data

}).catch(error => {
    console.error("Failed to connect to MongoDB:", error);
});

