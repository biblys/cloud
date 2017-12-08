'use strict';

const crypto   = require('crypto');
const stripe   = require('../lib/stripe-helper');

const User     = require('../models/user');
const Customer = require('../models/customer');
const Invoice  = require('../models/invoice');
const Payment  = require('../models/payment');

const debug = require('debug')('biblys-cloud:test');

const user = new User({
  name: 'An admin',
  axysSessionUid: crypto.randomBytes(16).toString('hex'),
  email: 'admin@biblys.fr',
  axysId: '1135'
});

const otherUser = new User({
  name: 'Another user',
  axysSessionUid: crypto.randomBytes(16).toString('hex'),
  email: 'other-user@biblys.fr',
  axysId: '1138'
});

const admin = new User({
  name: 'An admin-admin',
  axysSessionUid: crypto.randomBytes(16).toString('hex'),
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

const deletableCustomer = new Customer({
  name: 'Deletable Customer',
  email: 'deletable.customer@biblys.fr',
  axysId: '1137'
});

const customerInvoice = new Invoice({
  number: '1234',
  amount: '999',
  payed: false
});

const deletableInvoice = new Invoice({
  number: '1236',
  amount: '8999',
  payed: false
});

const otherInvoice = new Invoice({
  number: '1235',
  amount: '999',
  payed: false
});

const yetAnotherInvoice = new Invoice({
  number: '1235',
  amount: '999',
  payed: false
});

before(function(done) {
  (async function() {
    const stripeCustomer = await stripe.createCustomer({ token: 'tok_visa', email: 'customer@biblys.fr' });
    customer.stripeCustomerId = stripeCustomer.id;
    await customer.save();
    user.customer = customer._id;
    await user.save();
    await admin.save();
    await otherCustomer.save();
    otherUser.customer = otherCustomer._id;
    await otherUser.save();
    await deletableCustomer.save();
    customerInvoice.customer = customer._id;
    await customerInvoice.save();
    otherInvoice.customer = otherCustomer._id;
    await otherInvoice.save();
    yetAnotherInvoice.customer = customer._id;
    await yetAnotherInvoice.save();
    deletableInvoice.customer = customer._id;
    await deletableInvoice.save();
    done();
  })().catch(function(error) {
    debug(error);
    done();
  });
});

after(function(done) {
  (async function() {
    await User.remove({});
    await Customer.remove({});
    await Invoice.remove({});
    await Payment.remove({});
    done();
  })().catch(function(error) {
    debug(error);
    done();
  });
});

module.exports = {
  user, otherUser, admin,
  customer, otherCustomer, deletableCustomer,
  customerInvoice, otherInvoice, deletableInvoice, yetAnotherInvoice
};
