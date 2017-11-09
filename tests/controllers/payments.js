'use strict';

const chai     = require('chai');
const chaiHttp = require('chai-http');
const server   = require('../../bin/www');

const Customer = require('../../models/customer');
const Invoice  = require('../../models/invoice');
const Payment  = require('../../models/payment');

const debug = require('debug')('biblys-cloud:test');

const config  = require('../../config.js');

chai.should();
chai.use(chaiHttp);

let customer;
let admin;
let customerInvoice;
let otherInvoice;

describe('Payments controller', function() {
  before(function(done) {

    customer = new Customer({
      name: 'A Customer',
      axysSessionUid: 'xxxx',
      email: 'customer@biblys.fr',
      axysId: '1134'
    });

    admin = new Customer({
      name: 'An admin',
      axysSessionUid: 'yyyy',
      email: 'adminr@biblys.fr',
      axysId: '1135',
      isAdmin: true
    });

    customerInvoice = new Invoice({
      number: 1234,
      amount: 999,
      payed: false
    });

    otherInvoice = new Invoice({
      number: 1235,
      amount: 999,
      payed: false
    });

    customer.save().then(function() {
      return admin.save();
    }).then(function() {
      customerInvoice.customer = customer._id;
      return customerInvoice.save();
    }).then(function() {
      otherInvoice.customer = admin._id;
      return otherInvoice.save();
    }).then(function() {
      done();
    }).catch(function(error) {
      debug(error);
      done();
    });
  });

  // after(function(done) {
  //   Customer.collection.remove({}).then(function() {
  //     return Invoice.collection.remove({});
  //   }).then(function() {
  //     return Payment.collection.remove({});
  //   }).then(function() {
  //     done();
  //   }).catch(function(error) {
  //     debug(error);
  //     done();
  //   });
  // });

  describe('GET /payments/', function() {
    it('should return 401 for unlogged user', function(done) {
      chai.request(server)
        .get('/payments/')
        .end(function(err, res) {
          res.should.have.status(401);
          res.should.be.html;
          res.text.should.include('Connexion');
          done();
        });
    });

    it('should return 403 for non admin user', function(done) {
      chai.request(server)
        .get('/payments/')
        .set('Cookie', `userUid=${customer.axysSessionUid}`)
        .end(function(err, res) {
          res.should.have.status(403);
          res.should.be.html;
          res.text.should.include('For admin eyes only');
          done();
        });
    });

    it('should return 200 for admin user', function(done) {
      chai.request(server)
        .get('/payments/')
        .set('Cookie', `userUid=${admin.axysSessionUid}`)
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.html;
          res.text.should.include('Paiements');
          done();
        });
    });
  });

  describe('POST /payments/create', function() {

    it('should return 401 for unlogged user', function(done) {
      chai.request(server)
        .post('/payments/create')
        .end(function(err, res) {
          res.should.have.status(401);
          res.should.be.html;
          res.text.should.include('Connexion');
          done();
        });
    });

    it('should return 403 for unauthorized user', function(done) {
      chai.request(server)
        .post('/payments/create')
        .set('Cookie', `userUid=${customer.axysSessionUid}`)
        .send({ invoiceId: otherInvoice._id })
        .end(function(err, res) {
          res.should.have.status(403);
          res.should.be.html;
          res.text.should.include('You are not authorized to pay for this invoice.');
          done();
        });
    });

    it('should return 400 when not sending stripeToken', function(done) {
      chai.request(server)
        .post('/payments/create')
        .set('Cookie', `userUid=${customer.axysSessionUid}`)
        .send({ invoiceId: customerInvoice._id })
        .end(function(err, res) {
          res.should.have.status(400);
          res.should.be.html;
          res.text.should.include('Stripe token not provided.');
          done();
        });
    });

    it('should process payment', function(done) {

      // Create test stripe token
      const stripe = require('stripe')(config.STRIPE_SECRET_KEY);
      stripe.tokens.create({
        card: {
          number: '4242424242424242',
          exp_month: 12,
          exp_year: 2021,
          cvc: '123'
        }
      }, function(err, token) {
        chai.request(server)
          .post('/payments/create')
          .set('Cookie', `userUid=${customer.axysSessionUid}`)
          .send({ invoiceId: customerInvoice._id, stripeToken: token.id })
          .end(function(err, res) {
            res.should.redirect;
            done();
          });
      });
    });
  });
});
