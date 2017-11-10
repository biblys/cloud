'use strict';

const crypto   = require('crypto');

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

before(function(done) {
  customer.save().then(function() {
    user.customer = customer._id;
    return user.save();
  }).then(function() {
    return admin.save();
  }).then(function() {
    return otherCustomer.save();
  }).then(function() {
    customerInvoice.customer = customer._id;
    return customerInvoice.save();
  }).then(function() {
    otherInvoice.customer = otherCustomer._id;
    return otherInvoice.save();
  }).then(function() {
    deletableInvoice.customer = customer._id;
    return deletableInvoice.save();
  }).then(function() {
    done();
  }).catch(function(error) {
    debug(error);
    done();
  });
});

after(function(done) {
  User.remove({}).then(function() {
    return Customer.remove({});
  }).then(function() {
    return Invoice.remove({});
  }).then(function() {
    return Payment.remove({});
  }).then(function() {
    done();
  }).catch(function(error) {
    debug(error);
    done();
  });
});

module.exports = { user, admin, customer, otherCustomer, customerInvoice, otherInvoice, deletableInvoice };
