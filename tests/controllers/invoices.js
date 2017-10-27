'use strict';

const chai     = require('chai');
const chaiHttp = require('chai-http');
const server   = require('../../bin/www');
const mongoose = require('mongoose');

const Customer = require('../../models/customer');
const Invoice  = require('../../models/invoice');

const debug = require('debug')('biblys-cloud:test');

chai.should();
chai.use(chaiHttp);

let customer;
let admin;
let customerInvoice;
let otherInvoice;

describe('Invoices controller', function() {
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

  after(function(done) {
    Customer.collection.drop().then(function() {
      return Invoice.collection.drop();
    }).then(function() {
      done();
    }).catch(function(error) {
      debug(error);
      done();
    });
  });

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
        .set('Cookie', `userUid=${customer.axysSessionUid}`)
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

    it('should return 400 if amount field is missing', function(done) {
      chai.request(server)
        .post('/invoices/create')
        .set('Cookie', `userUid=${admin.axysSessionUid}`)
        .send({ number: 1145, customer: customer._id })
        .end(function(err, res) {
          res.should.have.status(400);
          res.should.be.html;
          res.text.should.include('Le champ montant est obligatoire.');
          done();
        });
    });

    it('should redirect admin user after invoice creation', function(done) {
      chai.request(server)
        .post('/invoices/create')
        .set('Cookie', `userUid=${admin.axysSessionUid}`)
        .send({ number: 1145, customer: customer._id, amount: 999 })
        .end(function(err, res) {
          res.should.redirect;
          done();
        });
    });
  });

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
        .get('/invoices/xxx')
        .set('Cookie', `userUid=${customer.axysSessionUid}`)
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
        .set('Cookie', `userUid=${customer.axysSessionUid}`)
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
        .set('Cookie', `userUid=${customer.axysSessionUid}`)
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

  // POST /invoices/:id/delete

  describe('POST /invoices/:id/delete', function() {
    it('should return 401 for unlogged user', function(done) {
      chai.request(server)
        .post(`/invoices/${customerInvoice._id}/delete`)
        .end(function(err, res) {
          res.should.have.status(401);
          res.should.be.html;
          res.text.should.include('Connexion');
          done();
        });
    });

    it('should return 403 for non admin user', function(done) {
      chai.request(server)
        .post(`/invoices/${customerInvoice._id}/delete`)
        .set('Cookie', `userUid=${customer.axysSessionUid}`)
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
        .post(`/invoices/${customerInvoice._id}/delete`)
        .set('Cookie', `userUid=${admin.axysSessionUid}`)
        .end(function(err, res) {
          res.should.have.status(200);
          done();
        });
    });
  });

});
