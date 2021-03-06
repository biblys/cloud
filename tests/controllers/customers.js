'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../bin/www');
const mongoose = require('mongoose');

chai.should();
chai.use(chaiHttp);

const request = chai.request(server).keepOpen();

const { user, admin, customer, deletableCustomer } = require('../test-data.js');

describe('Customers controller', function() {
  // GET /customers/new

  describe('GET /customers/new', function() {
    it('should return 401 for unlogged user', function(done) {
      request.get('/customers/new').end(function(err, res) {
        res.should.have.status(401);
        res.should.be.html;
        res.text.should.include('Connexion');
        done();
      });
    });

    it('should return 403 for non admin user', function(done) {
      request
        .get('/customers/new')
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

  // POST /customers/create

  describe('POST /customers/create', function() {
    it('should return 401 for unlogged user', function(done) {
      request.post('/customers/create').end(function(err, res) {
        res.should.have.status(401);
        res.should.be.html;
        res.text.should.include('Connexion');
        done();
      });
    });

    it('should return 403 for non admin user', function(done) {
      request
        .post('/customers/create')
        .set('Cookie', `userUid=${user.axysSessionUid}`)
        .end(function(err, res) {
          res.should.have.status(403);
          res.should.be.html;
          res.text.should.include('For admin eyes only');
          done();
        });
    });

    // Required fields

    it('should return 400 if name field is missing', function(done) {
      request
        .post('/customers/create')
        .set('Cookie', `userUid=${admin.axysSessionUid}`)
        .send()
        .end(function(err, res) {
          res.should.have.status(400);
          res.should.be.html;
          res.text.should.include('Le champ Nom est obligatoire.');
          done();
        });
    });

    it('should return 400 if email field is missing', function(done) {
      request
        .post('/customers/create')
        .set('Cookie', `userUid=${admin.axysSessionUid}`)
        .send({ name: 'A Customer' })
        .end(function(err, res) {
          res.should.have.status(400);
          res.should.be.html;
          res.text.should.include('Le champ E-mail est obligatoire.');
          done();
        });
    });

    // Success

    it('should redirect admin user after customer creation', function(done) {
      request
        .post('/customers/create')
        .set('Cookie', `userUid=${admin.axysSessionUid}`)
        .send({ name: 'A Customer', email: 'created-customer@biblys.fr' })
        .end(function(err, res) {
          res.should.redirect;
          done();
        });
    });
  });

  // GET /customers

  describe('GET /customers/', function() {
    it('should return 401 for unlogged user', function(done) {
      request.get('/customers/').end(function(err, res) {
        res.should.have.status(401);
        res.should.be.html;
        res.text.should.include('Connexion');
        done();
      });
    });

    it('should return 403 for non admin user', function(done) {
      request
        .get('/customers/')
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

  // GET /customers/edit

  describe('GET /customers/:id/edit', function() {
    it('should return 401 for unlogged user', function(done) {
      request.get(`/customers/${customer._id}/edit`).end(function(err, res) {
        res.should.have.status(401);
        res.should.be.html;
        res.text.should.include('Connexion');
        done();
      });
    });

    it('should return 403 for non admin user', function(done) {
      request
        .get(`/customers/${customer._id}/edit`)
        .set('Cookie', `userUid=${user.axysSessionUid}`)
        .end(function(err, res) {
          res.should.have.status(403);
          res.should.be.html;
          res.text.should.include('For admin eyes only');
          done();
        });
    });

    it('should return 404 for non existing customer', function(done) {
      request
        .get(`/customers/${mongoose.Types.ObjectId()}/edit`)
        .set('Cookie', `userUid=${admin.axysSessionUid}`)
        .end(function(err, res) {
          res.should.have.status(404);
          res.should.be.html;
          res.text.should.include('Customer Not Found');
          done();
        });
    });

    it('should return 200 for admin user', function(done) {
      request
        .get(`/customers/${customer._id}/edit`)
        .set('Cookie', `userUid=${admin.axysSessionUid}`)
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.html;
          res.text.should.include('Modifier un client');
          done();
        });
    });
  });

  // POST /customers/:id/update

  describe('POST /customers/:id/update', function() {
    it('should return 401 for unlogged user', function(done) {
      request.post(`/customers/${customer._id}/update`).end(function(err, res) {
        res.should.have.status(401);
        res.should.be.html;
        res.text.should.include('Connexion');
        done();
      });
    });

    it('should return 403 for non admin user', function(done) {
      request
        .post(`/customers/${customer._id}/update`)
        .set('Cookie', `userUid=${user.axysSessionUid}`)
        .end(function(err, res) {
          res.should.have.status(403);
          res.should.be.html;
          res.text.should.include('For admin eyes only');
          done();
        });
    });

    it('should return 404 for non existing customer', function(done) {
      request
        .post(`/customers/${mongoose.Types.ObjectId()}/update`)
        .set('Cookie', `userUid=${admin.axysSessionUid}`)
        .end(function(err, res) {
          res.should.have.status(404);
          res.should.be.html;
          res.text.should.include('Customer Not Found');
          done();
        });
    });

    // Required fields

    it('should return 400 if name field is missing', function(done) {
      request
        .post(`/customers/${customer._id}/update`)
        .set('Cookie', `userUid=${admin.axysSessionUid}`)
        .send()
        .end(function(err, res) {
          res.should.have.status(400);
          res.should.be.html;
          res.text.should.include('Le champ Nom est obligatoire.');
          done();
        });
    });

    it('should return 400 if email field is missing', function(done) {
      request
        .post(`/customers/${customer._id}/update`)
        .set('Cookie', `userUid=${admin.axysSessionUid}`)
        .send({ name: 'A Customer' })
        .end(function(err, res) {
          res.should.have.status(400);
          res.should.be.html;
          res.text.should.include('Le champ E-mail est obligatoire.');
          done();
        });
    });

    // Success

    it('should redirect admin user after customer creation', function(done) {
      request
        .post(`/customers/${customer._id}/update`)
        .set('Cookie', `userUid=${admin.axysSessionUid}`)
        .send({ name: 'A Customer', email: 'customer@biblys.fr' })
        .end(function(err, res) {
          res.should.redirect;
          done();
        });
    });
  });

  // POST /customers/:id/delete

  describe('POST /customers/:id/delete', function() {
    it('should return 401 for unlogged user', function(done) {
      request
        .post(`/customers/${deletableCustomer._id}/delete`)
        .end(function(err, res) {
          res.should.have.status(401);
          res.should.be.html;
          res.text.should.include('Connexion');
          done();
        });
    });

    it('should return 403 for non admin user', function(done) {
      request
        .post(`/customers/${deletableCustomer._id}/delete`)
        .set('Cookie', `userUid=${user.axysSessionUid}`)
        .end(function(err, res) {
          res.should.have.status(403);
          res.should.be.html;
          res.text.should.include('For admin eyes only');
          done();
        });
    });

    it('should return 404 for non existing customer', function(done) {
      request
        .post(`/customers/${mongoose.Types.ObjectId()}/delete`)
        .set('Cookie', `userUid=${admin.axysSessionUid}`)
        .end(function(err, res) {
          res.should.have.status(404);
          res.should.be.html;
          res.text.should.include('Customer Not Found');
          done();
        });
    });

    it('should redirect to customers list after deletion', function(done) {
      request
        .post(`/customers/${deletableCustomer._id}/delete`)
        .set('Cookie', `userUid=${admin.axysSessionUid}`)
        .end(function(err, res) {
          res.should.have.status(200);
          done();
        });
    });
  });
});
