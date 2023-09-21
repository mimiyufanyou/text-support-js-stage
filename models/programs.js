const mongoose = require('mongoose');

// Define the program schema
const programSchema = new mongoose.Schema({
  programId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  createdBy: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Add a pre-save hook to update the "updatedAt" field
programSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create the model
const Program = mongoose.model('Program', programSchema);

// Export the models
module.exports = {
  Program
};
