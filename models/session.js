const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Assuming 'User' is another model you've defined
    required: true
  },
  expiresAt: {
    type: Date,
    default: function() {
      // Set default expiration to 5 minutes from now 
      return new Date(Date.now() + 5 * 60 * 1000);
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);


