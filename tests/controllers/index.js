'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../bin/www');

chai.should();
chai.use(chaiHttp);

const request = chai.request(server).keepOpen();

// After all tests
after(function(done) {
  server.close();
  done();
});

const { user, admin } = require('../test-data.js');

describe('Index controller', function() {
  describe('GET /', function() {
    it('should display home page on / GET', function(done) {
      request.get('/').end(function(err, res) {
        res.should.have.status(200);
        res.should.be.html;
        res.text.should.include('Welcome to Biblys Cloud');
        done();
      });
    });
  });

  describe('GET /login', function() {
    it('should display login page', function(done) {
      request.get('/login').end(function(err, res) {
        res.should.have.status(401);
        res.should.be.html;
        res.text.should.include('Connexion');
        done();
      });
    });
  });

  describe('GET /logout', function() {
    it('should display login page', function(done) {
      request.get('/logout').end(function(err, res) {
        res.should.have.status(200);
        res.should.redirect;
        done();
      });
    });
  });

  describe('GET /admin/', function() {
    it('should prevent access for unlogged visitor', function(done) {
      request.get('/admin/').end(function(err, res) {
        res.should.have.status(401);
        done();
      });
    });

    it('should prevent access for logged non-admin user', function(done) {
      request
        .get('/admin/')
        .set('Cookie', `userUid=${user.axysSessionUid}`)
        .end(function(err, res) {
          res.should.have.status(403);
          done();
        });
    });

    it('should display admin page for admin user', function(done) {
      request
        .get('/admin/')
        .set('Cookie', `userUid=${admin.axysSessionUid}`)
        .end(function(err, res) {
          res.should.have.status(200);
          res.text.should.include('Administration');
          done();
        });
    });
  });
});
