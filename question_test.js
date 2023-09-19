const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let questionsData;  // Declare the variable at the module level

const loadQuizFromFile = (quizName) => {
    const folderPath = path.join(__dirname, 'config', 'questionnaires');  // Adjusted path
    const filePath = path.join(folderPath, `${quizName}_quiz.json`);

    if (fs.existsSync(filePath)) {
        questionsData = require(filePath);  // Assign the loaded data to questionsData
        return true;
    } else {
        console.log(`No quiz named ${quizName} found at path ${filePath}.`); // This will give you a clue where it's looking.
        return false;
    }
};

const askIfTakenQuiz = (quizName) => {
    rl.question(`Have you taken the ${quizName} test? (yes/no) `, (answer) => {
        if (answer.toLowerCase() === 'no') {
            const isQuizLoaded = loadQuizFromFile(quizName);

            if (isQuizLoaded) {
                console.log(`Starting the ${quizName} quiz...`);
                askQuestion('q1');  // Assuming every quiz starts with 'q1'
            } else {
                console.log(`No quiz named ${quizName} found.`);
                rl.close();
            }
        } else {
            console.log(`Okay! Let me know if you'd like to take another quiz.`);
            rl.close();
        }
    });
};

rl.question("Which quiz are you interested in (enneagram/stress)? ", (quizChoice) => {
    if (['enneagram', 'stress'].includes(quizChoice.toLowerCase())) {
        askIfTakenQuiz(quizChoice.toLowerCase());
    } else {
        console.log("I'm sorry, I didn't understand which quiz you want. Please specify either 'enneagram' or 'stress'.");
        rl.close();
    }
});

const askQuestion = (questionId) => {
    const specificQuestion = questionsData.questions.find(q => q.id === questionId);

    if (!specificQuestion) {
        console.log("All questions answered or invalid question ID.");
        rl.close();
        return;
    }

    console.log(specificQuestion.text); // Print the question text

    specificQuestion.options.forEach((option, index) => {
        console.log(`${index + 1}. ${option.text}`); // Print the option with a number
    });

    rl.question("Please select an option number: ", (answer) => {
        const chosenIndex = parseInt(answer) - 1;
        const chosenOption = specificQuestion.options[chosenIndex];

        if (chosenOption && chosenOption.next) {
            // Move to the next question
            askQuestion(chosenOption.next);
        } else if (chosenOption && chosenOption.result) {
            console.log(`Your result is: ${chosenOption.result}`);
            rl.close();
        } else {
            console.log("Invalid option. Please try again.");
            askQuestion(questionId); // Re-ask the same question
        }
    });
};