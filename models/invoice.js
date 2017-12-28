const mongoose = require('mongoose');

const InvoiceLineSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
});

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
  lines: [InvoiceLineSchema],
  amount: {
    type: Number,
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

InvoiceSchema.methods.calculateTotal = function() {
  const total = this.lines.reduce((total, line) => {
    return total + line.price;
  }, 0);
  this.amount = parseInt(total);
};

module.exports = mongoose.model('Invoice', InvoiceSchema);
