'use strict';

const chai     = require('chai');
const chaiHttp = require('chai-http');
const server   = require('../../bin/www');

const Customer = require('../../models/customer');
const Invoice  = require('../../models/invoice');

const debug = require('debug')('biblys-cloud:test');

chai.should();
chai.use(chaiHttp);

const { customer, admin, customerInvoice, otherInvoice } = require('../test-data.js');

describe('Customers controller', function() {
  before(function(done) {

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

  describe('GET /customers/new', function() {

    it('should return 401 for unlogged user', function(done) {
      chai.request(server)
        .get('/customers/new')
        .end(function(err, res) {
          res.should.have.status(401);
          res.should.be.html;
          res.text.should.include('Connexion');
          done();
        });
    });

    it('should return 403 for non admin user', function(done) {
      chai.request(server)
        .get('/customers/new')
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
        .get('/customers/new')
        .set('Cookie', `userUid=${admin.axysSessionUid}`)
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.html;
          res.text.should.include('Créer un nouveau client');
          done();
        });
    });
  });

  describe('POST /customers/create', function() {

    it('should return 401 for unlogged user', function(done) {
      chai.request(server)
        .post('/customers/create')
        .end(function(err, res) {
          res.should.have.status(401);
          res.should.be.html;
          res.text.should.include('Connexion');
          done();
        });
    });

    it('should return 403 for non admin user', function(done) {
      chai.request(server)
        .post('/customers/create')
        .set('Cookie', `userUid=${customer.axysSessionUid}`)
        .end(function(err, res) {
          res.should.have.status(403);
          res.should.be.html;
          res.text.should.include('For admin eyes only');
          done();
        });
    });

    // Required fields

    it('should return 400 if axysId field is missing', function(done) {
      chai.request(server)
        .post('/customers/create')
        .set('Cookie', `userUid=${admin.axysSessionUid}`)
        .end(function(err, res) {
          res.should.have.status(400);
          res.should.be.html;
          res.text.should.include('Le champ ID Axys est obligatoire.');
          done();
        });
    });

    it('should return 400 if name field is missing', function(done) {
      chai.request(server)
        .post('/customers/create')
        .set('Cookie', `userUid=${admin.axysSessionUid}`)
        .send({ axysId: 1145 })
        .end(function(err, res) {
          res.should.have.status(400);
          res.should.be.html;
          res.text.should.include('Le champ Nom est obligatoire.');
          done();
        });
    });

    it('should return 400 if email field is missing', function(done) {
      chai.request(server)
        .post('/customers/create')
        .set('Cookie', `userUid=${admin.axysSessionUid}`)
        .send({ axysId: 1145, name: 'A Customer' })
        .end(function(err, res) {
          res.should.have.status(400);
          res.should.be.html;
          res.text.should.include('Le champ E-mail est obligatoire.');
          done();
        });
    });

    // Success

    it('should redirect admin user after customer creation', function(done) {
      chai.request(server)
        .post('/customers/create')
        .set('Cookie', `userUid=${admin.axysSessionUid}`)
        .send({ axysId: 1145, name: 'A Customer', email: 'customer@biblys.fr' })
        .end(function(err, res) {
          res.should.redirect;
          done();
        });
    });
  });

  describe('GET /customers/', function() {
    it('should return 401 for unlogged user', function(done) {
      chai.request(server)
        .get('/customers/')
        .end(function(err, res) {
          res.should.have.status(401);
          res.should.be.html;
          res.text.should.include('Connexion');
          done();
        });
    });

    it('should return 403 for non admin user', function(done) {
      chai.request(server)
        .get('/customers/')
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
        .get('/customers/')
        .set('Cookie', `userUid=${admin.axysSessionUid}`)
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.html;
          res.text.should.include('Clients');
          done();
        });
    });
  });
});
