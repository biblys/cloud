'use strict';

const chai     = require('chai');
const chaiHttp = require('chai-http');
const server   = require('../../bin/www');
const stripe   = require('../../lib/stripe-helper.js');

chai.should();
chai.use(chaiHttp);

const {
  user, otherUser, admin,
  customer, customerInvoice, otherInvoice, yetAnotherInvoice,
  getStripeToken
} = require('../test-data.js');

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

    it('should return 400 when not sending Stripe card token', function(done) {
      chai.request(server)
        .post('/payments/create')
        .set('Cookie', `userUid=${user.axysSessionUid}`)
        .send({ invoiceId: customerInvoice._id })
        .end(function(err, res) {
          res.should.have.status(400);
          res.should.be.html;
          res.text.should.include('Stripe card token or card id must be provided.');
          done();
        });
    });

    it('should process payment with a saved card', async function() {

      const cards    = await stripe.getCards(customer.stripeCustomerId);
      const cardId   = cards[0].id;

      const res = await chai.request(server)
        .post('/payments/create')
        .set('Cookie', `userUid=${user.axysSessionUid}`)
        .send({ invoiceId: customerInvoice._id, stripeCard: cardId });

      res.should.redirect;
    });

    it('should process payment with a new card for a new customer', async function() {

      // Create test stripe token
      const token = await getStripeToken();

      const res = await chai.request(server)
        .post('/payments/create')
        .set('Cookie', `userUid=${otherUser.axysSessionUid}`)
        .send({ invoiceId: otherInvoice._id, stripeToken: token.id });

      res.should.redirect;
    });

    it('should process payment with a new card for an existing customer', async function() {

      // Create test stripe token
      const token = await getStripeToken();

      const res = await chai.request(server)
        .post('/payments/create')
        .set('Cookie', `userUid=${user.axysSessionUid}`)
        .send({ invoiceId: yetAnotherInvoice._id, stripeToken: token.id });

      res.should.redirect;
    });
  });
});
