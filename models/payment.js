const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  invoice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice',
    required: true
  },
  amount: {
    type: String,
    required: true
  },
  method: {
    type: String,
    enum: ['card', 'transfer', 'check'],
    default: 'card'
  },
  date: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

PaymentSchema.virtual('paymentDate').get(function() {
  if (typeof this.date !== 'undefined') {
    return this.date;
  }

  return this.createdAt;
});

module.exports = mongoose.model('Payment', PaymentSchema);
