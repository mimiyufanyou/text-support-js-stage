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