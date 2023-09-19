// controllers/userController.js

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

// Update user chat history
const appendToChatHistory = async (phoneNumber, chat) => {
    try {
        return await User.findOneAndUpdate(
            { phoneNumber: phoneNumber },
            { $push: { chatHistory: chat } },
            { new: true }  // return the updated user
        );
    } catch (error) {
        throw error;
    }
};

// Update system settings
const updateSystemSettings = async (phoneNumber, settings) => {
    try {
        const updatedUser = await User.findOneAndUpdate(
            { phoneNumber: phoneNumber },
            { systemSettings: settings },
            { new: true }  // return the updated user
        );
        console.log("Updated User System Settings:", updatedUser.systemSettings);
        return updatedUser;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createUser,
    getUserByPhoneNumber,
    appendToChatHistory,
    updateSystemSettings
};