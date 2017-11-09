const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  axysId: {
    type: String,
    required: true
  },
  axysSessionUid: {
    type: String
  },
  isAdmin: {
    type: mongoose.Schema.Types.Boolean,
    default: false
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
