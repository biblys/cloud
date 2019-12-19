'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../bin/www');
const mongoose = require('mongoose');

chai.should();
chai.use(chaiHttp);

const request = chai.request(server).keepOpen();

const { user, admin } = require('../test-data.js');

describe('Users controller', function() {
  // GET /users/new

  describe('GET /users/new', function() {
    it('should return 401 for unlogged user', function(done) {
      request.get('/users/new').end(function(err, res) {
        res.should.have.status(401);
        res.should.be.html;
        res.text.should.include('Connexion');
        done();
      });
    });

    it('should return 403 for non admin user', function(done) {
      request
        .get('/users/new')
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
        .get('/users/new')
        .set('Cookie', `userUid=${admin.axysSessionUid}`)
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.html;
          res.text.should.include('Créer un nouvel utilisateur');
          done();
        });
    });
  });

  // POST /users/create

  describe('POST /users/create', function() {
    it('should return 401 for unlogged user', function(done) {
      request.post('/users/create').end(function(err, res) {
        res.should.have.status(401);
        res.should.be.html;
        res.text.should.include('Connexion');
        done();
      });
    });

    it('should return 403 for non admin user', function(done) {
      request
        .post('/users/create')
        .set('Cookie', `userUid=${user.axysSessionUid}`)
        .end(function(err, res) {
          res.should.have.status(403);
          res.should.be.html;
          res.text.should.include('For admin eyes only');
          done();
        });
    });

    // Required fields

    it('should return 400 if axysId field is missing', function(done) {
      request
        .post('/users/create')
        .set('Cookie', `userUid=${admin.axysSessionUid}`)
        .end(function(err, res) {
          res.should.have.status(400);
          res.should.be.html;
          res.text.should.include('Le champ ID Axys est obligatoire.');
          done();
        });
    });

    it('should return 400 if name field is missing', function(done) {
      request
        .post('/users/create')
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
      request
        .post('/users/create')
        .set('Cookie', `userUid=${admin.axysSessionUid}`)
        .send({ axysId: 1145, name: 'A User' })
        .end(function(err, res) {
          res.should.have.status(400);
          res.should.be.html;
          res.text.should.include('Le champ E-mail est obligatoire.');
          done();
        });
    });

    // Success

    it('should redirect to admin index after user creation', function(done) {
      request
        .post('/users/create')
        .set('Cookie', `userUid=${admin.axysSessionUid}`)
        .send({ axysId: 1145, name: 'A User', email: 'created-user@biblys.fr' })
        .end(function(err, res) {
          res.should.redirect;
          done();
        });
    });
  });

  // GET /users

  describe('GET /users/', function() {
    it('should return 401 for unlogged user', function(done) {
      request.get('/users/').end(function(err, res) {
        res.should.have.status(401);
        res.should.be.html;
        res.text.should.include('Connexion');
        done();
      });
    });

    it('should return 403 for non admin user', function(done) {
      request
        .get('/users/')
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
        .get('/users/')
        .set('Cookie', `userUid=${admin.axysSessionUid}`)
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.html;
          res.text.should.include('Utilisateurs');
          done();
        });
    });
  });

  // GET /users/:id/edit

  describe('GET /users/:id/edit', function() {
    it('should return 401 for unlogged user', function(done) {
      request.get(`/users/${user._id}/edit`).end(function(err, res) {
        res.should.have.status(401);
        res.should.be.html;
        res.text.should.include('Connexion');
        done();
      });
    });

    it('should return 403 for non admin user', function(done) {
      request
        .get(`/users/${user._id}/edit`)
        .set('Cookie', `userUid=${user.axysSessionUid}`)
        .end(function(err, res) {
          res.should.have.status(403);
          res.should.be.html;
          res.text.should.include('For admin eyes only');
          done();
        });
    });

    it('should return 404 for non existing user', function(done) {
      request
        .get(`/users/${mongoose.Types.ObjectId()}/edit`)
        .set('Cookie', `userUid=${admin.axysSessionUid}`)
        .end(function(err, res) {
          res.should.have.status(404);
          res.should.be.html;
          res.text.should.include('User Not Found');
          done();
        });
    });

    it('should return 200 for admin user', function(done) {
      request
        .get(`/users/${user._id}/edit`)
        .set('Cookie', `userUid=${admin.axysSessionUid}`)
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.html;
          res.text.should.include('Modifier un utilisateur');
          done();
        });
    });
  });

  // POST /users/:id/update

  describe('POST /users/:id/update', function() {
    it('should return 401 for unlogged user', function(done) {
      request.post(`/users/${user._id}/update`).end(function(err, res) {
        res.should.have.status(401);
        res.should.be.html;
        res.text.should.include('Connexion');
        done();
      });
    });

    it('should return 403 for non admin user', function(done) {
      request
        .post(`/users/${user._id}/update`)
        .set('Cookie', `userUid=${user.axysSessionUid}`)
        .end(function(err, res) {
          res.should.have.status(403);
          res.should.be.html;
          res.text.should.include('For admin eyes only');
          done();
        });
    });

    it('should return 404 for non existing user', function(done) {
      request
        .post(`/users/${mongoose.Types.ObjectId()}/update`)
        .set('Cookie', `userUid=${admin.axysSessionUid}`)
        .end(function(err, res) {
          res.should.have.status(404);
          res.should.be.html;
          res.text.should.include('User Not Found');
          done();
        });
    });

    // Required fields

    it('should return 400 if axysId field is missing', function(done) {
      request
        .post(`/users/${user._id}/update`)
        .set('Cookie', `userUid=${admin.axysSessionUid}`)
        .end(function(err, res) {
          res.should.have.status(400);
          res.should.be.html;
          res.text.should.include('Le champ ID Axys est obligatoire.');
          done();
        });
    });

    it('should return 400 if name field is missing', function(done) {
      request
        .post(`/users/${user._id}/update`)
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
      request
        .post(`/users/${user._id}/update`)
        .set('Cookie', `userUid=${admin.axysSessionUid}`)
        .send({ axysId: 1145, name: 'A User' })
        .end(function(err, res) {
          res.should.have.status(400);
          res.should.be.html;
          res.text.should.include('Le champ E-mail est obligatoire.');
          done();
        });
    });

    // Success

    it('should redirect admin user after user creation', function(done) {
      request
        .post(`/users/${user._id}/update`)
        .set('Cookie', `userUid=${admin.axysSessionUid}`)
        .send({ axysId: 1145, name: 'A User', email: 'user@biblys.fr' })
        .end(function(err, res) {
          res.should.redirect;
          done();
        });
    });
  });
});
