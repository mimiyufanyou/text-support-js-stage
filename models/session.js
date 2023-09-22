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
      // Set default expiration to 15 minutes from now 
      return new Date(Date.now() + 15 * 60 * 1000);
    }
  }
});

module.exports = mongoose.model('Session', sessionSchema);


