'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../bin/www');
const stripe = require('../../lib/stripe-helper.js');

chai.should();
chai.use(chaiHttp);

const request = chai.request(server).keepOpen();

const {
  user,
  otherUser,
  admin,
  customer,
  customerInvoice,
  otherInvoice,
  yetAnotherInvoice,
} = require('../test-data.js');

describe('Payments controller', function() {
  // GET /payments/

  describe('GET /payments/', function() {
    it('should return 401 for unlogged user', function(done) {
      request.get('/payments/').end(function(err, res) {
        res.should.have.status(401);
        res.should.be.html;
        res.text.should.include('Connexion');
        done();
      });
    });

    it('should return 403 for non admin user', function(done) {
      request
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
      request
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

  // GET /payments/new

  describe('GET /payments/new', function() {
    it('should return 401 for unlogged user', function(done) {
      request.get('/payments/new').end(function(err, res) {
        res.should.have.status(401);
        res.should.be.html;
        res.text.should.include('Connexion');
        done();
      });
    });

    it('should return 403 for non admin user', function(done) {
      request
        .get('/payments/new')
        .set('Cookie', `userUid=${user.axysSessionUid}`)
        .end(function(err, res) {
          res.should.have.status(403);
          res.should.be.html;
          res.text.should.include('For admin eyes only');
          done();
        });
    });

    it('should return 200 for admin user', function(done) {
      request
        .get('/payments/new')
        .set('Cookie', `userUid=${admin.axysSessionUid}`)
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.html;
          res.text.should.include('Ajouter un paiement');
          done();
        });
    });
  });

  // POST /payments/create-from-form

  describe('POST /payments/create-from-form', function() {
    it('should return 401 for unlogged user', function(done) {
      request.post('/payments/create-from-form').end(function(err, res) {
        res.should.have.status(401);
        res.should.be.html;
        res.text.should.include('Connexion');
        done();
      });
    });

    it('should return 403 for non-admin user', function(done) {
      request
        .post('/payments/create-from-form')
        .set('Cookie', `userUid=${user.axysSessionUid}`)
        .end(function(err, res) {
          res.should.have.status(403);
          res.should.be.html;
          res.text.should.include('For admin eyes only');
          done();
        });
    });

    it('should return 400 when not sending invoice id', function(done) {
      request
        .post('/payments/create-from-form')
        .set('Cookie', `userUid=${admin.axysSessionUid}`)
        .end(function(err, res) {
          res.should.have.status(400);
          res.should.be.html;
          res.text.should.include('invoiceId parameter must be provided');
          done();
        });
    });

    it('should return 400 when not sending payment method', function(done) {
      request
        .post('/payments/create-from-form')
        .set('Cookie', `userUid=${admin.axysSessionUid}`)
        .send({ invoiceId: customerInvoice._id })
        .end(function(err, res) {
          res.should.have.status(400);
          res.should.be.html;
          res.text.should.include('Method must be provided.');
          done();
        });
    });

    it('should return 400 when not sending payment date', function(done) {
      request
        .post('/payments/create-from-form')
        .set('Cookie', `userUid=${admin.axysSessionUid}`)
        .send({ invoiceId: customerInvoice._id, method: 'transfer' })
        .end(function(err, res) {
          res.should.have.status(400);
          res.should.be.html;
          res.text.should.include('Date must be provided.');
          done();
        });
    });

    it('should redirect after successful payment creation', function(done) {
      request
        .post('/payments/create-from-form')
        .set('Cookie', `userUid=${admin.axysSessionUid}`)
        .send({
          invoiceId: customerInvoice._id,
          method: 'transfer',
          date: '2017-01-10',
        })
        .end(function(err, res) {
          res.should.redirect;
          done();
        });
    });
  });

  // POST /payments/create

  describe('POST /payments/create', function() {
    it('should return 401 for unlogged user', function(done) {
      request.post('/payments/create').end(function(err, res) {
        res.should.have.status(401);
        res.should.be.html;
        res.text.should.include('Connexion');
        done();
      });
    });

    it('should return 403 for unauthorized user', function(done) {
      request
        .post('/payments/create')
        .set('Cookie', `userUid=${user.axysSessionUid}`)
        .send({ invoiceId: otherInvoice._id })
        .end(function(err, res) {
          res.should.have.status(403);
          res.should.be.html;
          res.text.should.include(
            'You are not authorized to see this invoice.',
          );
          done();
        });
    });

    it('should return 400 when not sending Stripe card token', function(done) {
      request
        .post('/payments/create')
        .set('Cookie', `userUid=${user.axysSessionUid}`)
        .send({ invoiceId: customerInvoice._id })
        .end(function(err, res) {
          res.should.have.status(400);
          res.should.be.html;
          res.text.should.include(
            'Stripe card token or card id must be provided.',
          );
          done();
        });
    });

    it('should process payment with a saved card', async function() {
      const cards = await stripe.getCards(customer.stripeCustomerId);
      const cardId = cards[0].id;

      const res = await request
        .post('/payments/create')
        .set('Cookie', `userUid=${user.axysSessionUid}`)
        .send({ invoiceId: customerInvoice._id, stripeCard: cardId });

      res.should.redirect;
    });

    it('should process payment with a new card for a new customer', async function() {
      const res = await request
        .post('/payments/create')
        .set('Cookie', `userUid=${otherUser.axysSessionUid}`)
        .send({ invoiceId: otherInvoice._id, stripeToken: 'tok_visa' });

      res.should.redirect;
    });

    it('should process payment with a new card for an existing customer', async function() {
      const res = await request
        .post('/payments/create')
        .set('Cookie', `userUid=${user.axysSessionUid}`)
        .send({ invoiceId: yetAnotherInvoice._id, stripeToken: 'tok_visa' });

      res.should.redirect;
    });
  });
});
