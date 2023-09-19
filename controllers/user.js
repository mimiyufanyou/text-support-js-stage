// controllers/user.js

const User = require('../models/user');

// Create a new user
const createUser = async (userData) => {
    try {
        const user = new User(userData);
        return await user.save();
    } catch (error) {
        throw error;
    }
};

// Retrieve a user by phone number
const getUserByPhoneNumber = async (phoneNumber) => {
    try {
        return await User.findOne({ phoneNumber: phoneNumber });
    } catch (error) {
        throw error;
    }
};

const updateUserChatAndSettings = async (phoneNumber, chat, settings) => {
    try {
        const updatedUser = await User.findOneAndUpdate(
            { phoneNumber: phoneNumber },
            {
                $push: { chatHistory: chat },
                $set: settings,
                $inc: { 'systemSettings.0.currentQuestion': 1 }
            },
            { new: true }  // return the updated user
        );

        console.log("Updated User Chat & System Settings:", updatedUser);
        return updatedUser;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createUser,
    getUserByPhoneNumber,
    updateUserChatAndSettings,
};