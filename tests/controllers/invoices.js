'use strict';

const chai     = require('chai');
const chaiHttp = require('chai-http');
const server   = require('../../bin/www');
const mongoose = require('mongoose');

chai.should();
chai.use(chaiHttp);

const { user, admin, customer, customerInvoice, otherInvoice, deletableInvoice } = require('../test-data.js');

describe('Invoices controller', function() {

  describe('GET /invoices/new', function() {

    it('should return 401 for unlogged user', function(done) {
      chai.request(server)
        .get('/invoices/new')
        .end(function(err, res) {
          res.should.have.status(401);
          res.should.be.html;
          res.text.should.include('Connexion');
          done();
        });
    });

    it('should return 403 for non admin user', function(done) {
      chai.request(server)
        .get('/invoices/new')
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
        .get('/invoices/new')
        .set('Cookie', `userUid=${admin.axysSessionUid}`)
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.html;
          res.text.should.include('Créer une facture');
          done();
        });
    });
  });

  // POST /invoices/create

  describe('POST /invoices/create', function() {
    it('should return 401 for unlogged user', function(done) {
      chai.request(server)
        .post('/invoices/create')
        .end(function(err, res) {
          res.should.have.status(401);
          res.should.be.html;
          res.text.should.include('Connexion');
          done();
        });
    });

    it('should return 403 for non admin user', function(done) {
      chai.request(server)
        .post('/invoices/create')
        .set('Cookie', `userUid=${user.axysSessionUid}`)
        .end(function(err, res) {
          res.should.have.status(403);
          res.should.be.html;
          res.text.should.include('For admin eyes only');
          done();
        });
    });

    it('should return 400 if number field is missing', function(done) {
      chai.request(server)
        .post('/invoices/create')
        .set('Cookie', `userUid=${admin.axysSessionUid}`)
        .end(function(err, res) {
          res.should.have.status(400);
          res.should.be.html;
          res.text.should.include('Le champ numéro est obligatoire.');
          done();
        });
    });

    it('should return 400 if customer field is missing', function(done) {
      chai.request(server)
        .post('/invoices/create')
        .set('Cookie', `userUid=${admin.axysSessionUid}`)
        .send({ number: 1145 })
        .end(function(err, res) {
          res.should.have.status(400);
          res.should.be.html;
          res.text.should.include('Le champ client est obligatoire.');
          done();
        });
    });

    it('should return 400 if customerAddress field is missing', function(done) {
      chai.request(server)
        .post('/invoices/create')
        .set('Cookie', `userUid=${admin.axysSessionUid}`)
        .send({ number: 1145, customer: customer._id })
        .end(function(err, res) {
          res.should.have.status(400);
          res.should.be.html;
          res.text.should.include('Le champ Adresse du client est obligatoire.');
          done();
        });
    });

    it('should return 400 if date field is missing', function(done) {
      chai.request(server)
        .post('/invoices/create')
        .set('Cookie', `userUid=${admin.axysSessionUid}`)
        .send({ number: 1145, customer: customer._id, customerAddress: 'Address' })
        .end(function(err, res) {
          res.should.have.status(400);
          res.should.be.html;
          res.text.should.include('Le champ Date est obligatoire.');
          done();
        });
    });

    it('should redirect admin user after invoice creation', function(done) {
      chai.request(server)
        .post('/invoices/create')
        .set('Cookie', `userUid=${admin.axysSessionUid}`)
        .send({ number: 1145, customer: customer._id, customerAddress: 'Address', date: '1969-07-20' })
        .end(function(err, res) {
          res.should.redirect;
          done();
        });
    });
  });

  // GET /invoices/

  describe('GET /invoices/', function() {
    it('should return 401 for unlogged user', function(done) {
      chai.request(server)
        .get('/invoices/')
        .end(function(err, res) {
          res.should.have.status(401);
          res.should.be.html;
          res.text.should.include('Connexion');
          done();
        });
    });

    it('should return 403 for non admin user', function(done) {
      chai.request(server)
        .get('/invoices/')
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
        .get('/invoices/')
        .set('Cookie', `userUid=${admin.axysSessionUid}`)
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.html;
          res.text.should.include('Factures');
          done();
        });
    });
  });

  // GET /invoices/:id

  describe('GET /invoices/:id', function() {

    it('should return 401 for unlogged user', function(done) {
      chai.request(server)
        .get('/invoices/xxx')
        .end(function(err, res) {
          res.should.have.status(401);
          res.should.be.html;
          res.text.should.include('Connexion');
          done();
        });
    });

    it('should return 404 for non existing invoice', function(done) {
      chai.request(server)
        .get(`/invoices/${mongoose.Types.ObjectId()}`)
        .set('Cookie', `userUid=${user.axysSessionUid}`)
        .end(function(err, res) {
          res.should.have.status(404);
          res.should.be.html;
          res.text.should.include('Invoice Not Found');
          done();
        });
    });

    it('should return 403 for unauthorized user', function(done) {
      chai.request(server)
        .get(`/invoices/${otherInvoice._id}`)
        .set('Cookie', `userUid=${user.axysSessionUid}`)
        .end(function(err, res) {
          res.should.have.status(403);
          res.should.be.html;
          res.text.should.include('You are not authorized to see this invoice.');
          done();
        });
    });

    it('should display invoice for authorized user', function(done) {
      chai.request(server)
        .get(`/invoices/${customerInvoice._id}`)
        .set('Cookie', `userUid=${user.axysSessionUid}`)
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.html;
          res.text.should.include('Facture n° 1234');
          done();
        });
    });

    it('should allow admin to access all invoices', function(done) {
      chai.request(server)
        .get(`/invoices/${customerInvoice._id}`)
        .set('Cookie', `userUid=${admin.axysSessionUid}`)
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.html;
          res.text.should.include('Facture n° 1234');
          done();
        });
    });
  });

  // GET /invoices/:id/pay

  describe('GET /invoices/:id/pay', function() {

    it('should return 401 for unlogged user', function(done) {
      chai.request(server)
        .get('/invoices/xxx/pay')
        .end(function(err, res) {
          res.should.have.status(401);
          res.should.be.html;
          res.text.should.include('Connexion');
          done();
        });
    });

    it('should return 404 for non existing invoice', function(done) {
      chai.request(server)
        .get(`/invoices/${mongoose.Types.ObjectId()}/pay`)
        .set('Cookie', `userUid=${user.axysSessionUid}`)
        .end(function(err, res) {
          res.should.have.status(404);
          res.should.be.html;
          res.text.should.include('Invoice Not Found');
          done();
        });
    });

    it('should return 403 for unauthorized user', function(done) {
      chai.request(server)
        .get(`/invoices/${otherInvoice._id}/pay`)
        .set('Cookie', `userUid=${user.axysSessionUid}`)
        .end(function(err, res) {
          res.should.have.status(403);
          res.should.be.html;
          res.text.should.include('You are not authorized to see this invoice.');
          done();
        });
    });

    it('should allow authorized user to access page', function(done) {
      chai.request(server)
        .get(`/invoices/${customerInvoice._id}/pay`)
        .set('Cookie', `userUid=${user.axysSessionUid}`)
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.html;
          res.text.should.include(`Facture n° ${customerInvoice.number} pour ${customer.name}`);
          done();
        });
    });

    it('should allow admin to access all invoices', function(done) {
      chai.request(server)
        .get(`/invoices/${customerInvoice._id}/pay`)
        .set('Cookie', `userUid=${admin.axysSessionUid}`)
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.html;
          res.text.should.include(`Facture n° ${customerInvoice.number} pour ${customer.name}`);
          done();
        });
    });
  });

  // POST /invoices/:id/delete

  describe('POST /invoices/:id/delete', function() {
    it('should return 401 for unlogged user', function(done) {
      chai.request(server)
        .post(`/invoices/${deletableInvoice._id}/delete`)
        .end(function(err, res) {
          res.should.have.status(401);
          res.should.be.html;
          res.text.should.include('Connexion');
          done();
        });
    });

    it('should return 403 for non admin user', function(done) {
      chai.request(server)
        .post(`/invoices/${deletableInvoice._id}/delete`)
        .set('Cookie', `userUid=${user.axysSessionUid}`)
        .end(function(err, res) {
          res.should.have.status(403);
          res.should.be.html;
          res.text.should.include('For admin eyes only');
          done();
        });
    });

    it('should return 404 for non existing invoice', function(done) {
      chai.request(server)
        .post(`/invoices/${mongoose.Types.ObjectId()}/delete`)
        .set('Cookie', `userUid=${admin.axysSessionUid}`)
        .end(function(err, res) {
          res.should.have.status(404);
          res.should.be.html;
          res.text.should.include('Invoice Not Found');
          done();
        });
    });

    it('should redirect to invoices list after deletion', function(done) {
      chai.request(server)
        .post(`/invoices/${deletableInvoice._id}/delete`)
        .set('Cookie', `userUid=${admin.axysSessionUid}`)
        .end(function(err, res) {
          res.should.have.status(200);
          done();
        });
    });
  });

  // GET /invoices/:id/edit

  describe('GET /invoices/:id/edit', function() {

    it('should return 401 for unlogged user', function(done) {
      chai.request(server)
        .get(`/invoices/${customerInvoice._id}/edit`)
        .end(function(err, res) {
          res.should.have.status(401);
          res.should.be.html;
          res.text.should.include('Connexion');
          done();
        });
    });

    it('should return 403 for non admin user', function(done) {
      chai.request(server)
        .get(`/invoices/${customerInvoice._id}/edit`)
        .set('Cookie', `userUid=${user.axysSessionUid}`)
        .end(function(err, res) {
          res.should.have.status(403);
          res.should.be.html;
          res.text.should.include('For admin eyes only');
          done();
        });
    });

    it('should return 404 for non existing invoice', function(done) {
      chai.request(server)
        .get(`/invoices/${mongoose.Types.ObjectId()}/edit`)
        .set('Cookie', `userUid=${admin.axysSessionUid}`)
        .end(function(err, res) {
          res.should.have.status(404);
          res.should.be.html;
          res.text.should.include('Invoice Not Found');
          done();
        });
    });

    it('should return 200 for admin user', function(done) {
      chai.request(server)
        .get(`/invoices/${customerInvoice._id}/edit`)
        .set('Cookie', `userUid=${admin.axysSessionUid}`)
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.html;
          res.text.should.include('Modifier une facture');
          done();
        });
    });
  });

});
