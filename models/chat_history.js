const mongoose = require('mongoose');

const emotionalStateSchema = new mongoose.Schema({
  Valence: { type: Number, default: 0.0 },
  Arousal: { type: Number, default: 0.0 },
  Potency: { type: Number, default: 0.0 }
});

const primaryEmotionsSchema = new mongoose.Schema({
  Happiness: { type: Number, default: 0 },
  Sadness: { type: Number, default: 0 },
  Fear: { type: Number, default: 0 },
  Disgust: { type: Number, default: 0 },
  Anger: { type: Number, default: 0 },
  Surprise: { type: Number, default: 0 }
});

const cognitiveDimensionsSchema = new mongoose.Schema({
  Certainty: { type: Number, default: 0.0 },
  Attention: { type: Number, default: 0.0 },
  Control: { type: Number, default: 0.0 }
});

const socialEmotionsSchema = new mongoose.Schema({
  Embarrassment: { type: Number, default: 0 },
  Guilt: { type: Number, default: 0 },
  Pride: { type: Number, default: 0 },
  Shame: { type: Number, default: 0 }
});

const contextSchema = new mongoose.Schema({
  SocialSetting: { type: String, default: "" },
  Activity: { type: String, default: "" },
  Object: { type: String, default: "" }
});

const earlSchema = new mongoose.Schema({
  EmotionalState: emotionalStateSchema,
  PrimaryEmotions: primaryEmotionsSchema,
  CognitiveDimensions: cognitiveDimensionsSchema,
  SocialEmotions: socialEmotionsSchema,
  Context: contextSchema,
  Intensity: { type: Number, default: 0.0 }
});

// Define the chat session schema
const chatHistorySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  sessionId: {
    type: String,
    required: true
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  summary: {
    type: Object,
    required: false
  }, 
  dynamic: {
    type: mongoose.Schema.Types.Mixed,
    required: false
  }, 
  dyadicAnalysis: [], 
  EARL: [earlSchema], 
  urgency_score: [],
  complexity_score: [] 
}, { timestamps: true 
});

// Create the model
const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);

module.exports = ChatHistory;


