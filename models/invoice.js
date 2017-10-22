const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  amount: {
    type: String,
    required: true
  },
  payed: {
    type: mongoose.Schema.Types.Boolean,
    required: true
  },
  payedAt: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
