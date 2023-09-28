const mongoose = require('mongoose');

// Define the progress schema
const progressSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  activityId: {
    type: String,
    required: true
  },
  currentStage: {
    type: String,
    required: true,
    default: 'Not Started'
  },
  milestones: [{
    milestoneName: String,
    completed: Boolean,
    completedAt: Date
  }],
  startedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  notes: String
}, { timestamps: true });

// Add a pre-save hook to update the "updatedAt" field
progressSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create the model
const Progress = mongoose.model('Progress', progressSchema);

module.exports = Progress;