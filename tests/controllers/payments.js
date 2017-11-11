'use strict';

const chai     = require('chai');
const chaiHttp = require('chai-http');
const server   = require('../../bin/www');

const config  = require('../../config.js');

chai.should();
chai.use(chaiHttp);

const { user, admin, customerInvoice, otherInvoice } = require('../test-data.js');

describe('Payments controller', function() {

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
        .set('Cookie', `userUid=${user.axysSessionUid}`)
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
        .set('Cookie', `userUid=${user.axysSessionUid}`)
        .send({ invoiceId: otherInvoice._id })
        .end(function(err, res) {
          res.should.have.status(403);
          res.should.be.html;
          res.text.should.include('You are not authorized to see this invoice.');
          done();
        });
    });

    it('should return 400 when not sending stripeToken', function(done) {
      chai.request(server)
        .post('/payments/create')
        .set('Cookie', `userUid=${user.axysSessionUid}`)
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
          .set('Cookie', `userUid=${user.axysSessionUid}`)
          .send({ invoiceId: customerInvoice._id, stripeToken: token.id })
          .end(function(err, res) {
            res.should.redirect;
            done();
          });
      });
    });
  });
});
