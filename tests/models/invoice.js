const chai = require('chai');

const Invoice = require('../../models/invoice');

const expect = chai.expect;

const invoice = new Invoice({
  amount: 10,
  lines: [
    { label: 'Line 1', price: 110 },
    { label: 'Line 2', price: 220 },
    { label: 'Line 3', price: 330 }
  ]
});

describe('Invoice model', function() {

  describe('Calculate total', function() {
    invoice.calculateTotal();
    expect(invoice.amount).to.equal(660);
  });

});
