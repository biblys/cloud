'use strict';

const User     = require('../models/user');
const Customer = require('../models/customer');
const Invoice  = require('../models/invoice');

const user = new User({
  name: 'A user',
  axysSessionUid: 'xxxx',
  email: 'user@biblys.fr',
  axysId: '1134'
});

const admin = new User({
  name: 'An admin',
  axysSessionUid: 'yyyy',
  email: 'admin@biblys.fr',
  axysId: '1135',
  isAdmin: true
});

const customer = new Customer({
  name: 'A Customer',
  email: 'customer@biblys.fr',
  axysId: '1135'
});

const otherCustomer = new Customer({
  name: 'Another Customer',
  email: 'another.customer@biblys.fr',
  axysId: '1136'
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

module.exports = { user, admin, customer, otherCustomer, customerInvoice, otherInvoice };
