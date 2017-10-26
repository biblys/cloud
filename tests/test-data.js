'use strict';

const Customer = require('../models/customer');
const Invoice  = require('../models/invoice');

const customer = new Customer({
  name: 'A Customer',
  axysSessionUid: 'xxxx',
  email: 'customer@biblys.fr',
  axysId: '1134'
});

const admin = new Customer({
  name: 'An admin',
  axysSessionUid: 'yyyy',
  email: 'adminr@biblys.fr',
  axysId: '1135',
  isAdmin: true
});

const customerInvoice = new Invoice({
  number: 1234,
  amount: 999,
  payed: false
});

const otherInvoice = new Invoice({
  number: 1235,
  amount: 999,
  payed: false
});

module.exports = { customer, admin, customerInvoice, otherInvoice };
