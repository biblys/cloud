const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  axysId: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Customer', CustomerSchema);
