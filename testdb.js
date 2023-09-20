const { connect } = require('./config/db');
const mongoose = require('mongoose');

async function testConnection() {
    try {
        await connect();
        console.log("Successfully tested the MongoDB connection.");
    } catch (error) {
        console.error("Failed to connect to MongoDB during the test:", error);
    } finally {
        // Close the connection after testing
        await mongoose.disconnect();
    }
}

testConnection();

