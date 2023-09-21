// controllers/user.js

const User = require('../models/user');

// Create a new user
const createUser = async (userData) => {
    try {
        const user = new User(userData);
        return await user.save();
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};

// Retrieve a user by phone number
const getUserByPhoneNumber = async (phoneNumber) => {
    try {
        return await User.findOne({ phoneNumber: phoneNumber });
    } catch (error) {
        console.error("Error retrieving user by phone number:", error);
        throw error;
    }
};

// find a user, and then update the chat history and system settings
// const updateUserChatAndSettings = async (phoneNumber, chat, settings, questionId) => {
//     try {
//         const updatedUser = await User.findOneAndUpdate(
//             { phoneNumber: phoneNumber },
//             {
//                 $push: { chatHistory: chat },
//                 $set: {
//                     'systemSettings.0.context': settings.context,
//                     'systemSettings.0.state': settings.state,
//                     'systemSettings.0.answers': settings.answers,
//                 },
//                 $set: { 'systemSettings.0.currentQuestion': 1 }
//             },
//             { new: true }  // return the updated user
//         );

//         console.log("Updated User Chat & System Settings:", updatedUser);
//         return updatedUser;
//     } catch (error) {
//         console.error("Error updating user chat and settings:", error);
//         throw error;
//     }
// };

module.exports = {
    createUser,
    getUserByPhoneNumber,
    // updateUserChatAndSettings,
};