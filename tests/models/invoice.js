const chai = require('chai');

const Invoice = require('../../models/invoice');

const expect = chai.expect;

const invoice = new Invoice({
  amount: 10,
  lines: [
    { label: 'Line 1', price: 1.1 },
    { label: 'Line 2', price: 2.2 },
    { label: 'Line 3', price: 3.3 }
  ]
});

describe('Invoice model', function() {

  describe('Calculate total', function() {
    invoice.calculateTotal();
    expect(invoice.amount).to.equal('6.6');
  });

});
