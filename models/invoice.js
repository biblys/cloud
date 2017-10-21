const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
  number: {
    type: String,
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
