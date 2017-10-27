const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  axysId: {
    type: String,
    required: true
  },
  axysSessionUid: {
    type: String
  },
  isAdmin: {
    type: mongoose.Schema.Types.Boolean,
    default: false,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  stripeCustomerId: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Customer', CustomerSchema);
