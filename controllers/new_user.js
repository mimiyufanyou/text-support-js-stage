// Description: Controller for registering a new user
// Path: controllers/new_user.js

const User = require('./models/user'); // your user model
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

const { sendSmsMessage } = require('./controllers/message');

const registerNewUser = async (userData) => {
  // Check if user already exists
  let user = await User.findOne({ phoneNumber: userData.phoneNumber });
  if (user) {
    throw new Error("User already exists.");
  }

  // Hash the password 
  const hashedPassword = await bcrypt.hash(userData.password, 10);
    
  // Create new user
  const newUser = new User({
    userId: uuidv4(),
    username: userData.preferredName,
    phoneNumber: userData.phoneNumber,
    confirmed: false, 
    email: userData.email,
    password: hashedPassword,
    programs: [],
    quizResults: [],
    chatHistory: [],
    userContext: []
  }); 

  // Save new user to database

  sendSmsMessage(userData.phoneNumber, `Welcome! Please confirm your number ${userData.preferredName}!`);

  try {
    await newUser.save();
    return { status: 'success', message: 'User created successfully. Awaiting confirmation.' };
  } catch (err) {
    console.error("Error initializing new user:", err);
    return { status: 'error', message: 'Failed to create user.' };
  }
};

module.exports = {
    registerNewUser,
};