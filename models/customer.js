const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
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
