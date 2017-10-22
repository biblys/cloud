const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  axysId: {
    type: String,
    required: true
  },
  isAdmin: {
    type: mongoose.Schema.Types.Boolean,
    default: false,
    required: true
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Customer', CustomerSchema);
