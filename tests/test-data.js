'use strict';

const crypto   = require('crypto');
const stripe   = require('stripe')(process.env.STRIPE_SECRET_KEY);

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

const stripeCard = {
  card: {
    number: '4242424242424242',
    exp_month: 12,
    exp_year: 2021,
    cvc: '123'
  }
};

const getStripeToken = async function() {
  return await stripe.tokens.create({
    card: {
      number: '4242424242424242',
      exp_month: 12,
      exp_year: 2021,
      cvc: '123'
    }
  });
};

before(function(done) {
  (async function() {
    const token = await stripe.tokens.create(stripeCard);
    const stripeCustomer = await stripe.customers.create({ email: customer.email, source: token.id });
    customer.stripeCustomerId = stripeCustomer.id;
    await customer.save();
    user.customer = customer._id;
    await user.save();
    await admin.save();
    await otherCustomer.save();
    customerInvoice.customer = customer._id;
    await customerInvoice.save();
    otherInvoice.customer = otherCustomer._id;
    await otherInvoice.save();
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
  user, admin,
  customer, otherCustomer,
  customerInvoice, otherInvoice, deletableInvoice,
  getStripeToken
};
