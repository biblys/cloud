'use strict';

const chai     = require('chai');
const chaiHttp = require('chai-http');
const server   = require('../../bin/www');

chai.should();
chai.use(chaiHttp);

after(function(done) {
  server.close();
  done();
});

describe('GET /', function() {

  it('should display home page on / GET', function(done) {
    chai.request(server)
      .get('/')
      .end(function(err, res) {
        res.should.have.status(200);
        done();
      });
  });
});

describe('GET /login', function() {
  it('should display login page');
});

describe('GET /logout', function() {
  it('should display logout page');
});

describe('GET /admin/', function() {

  it('should prevent access /admin/ for unlogged visitor', function(done) {
    chai.request(server)
      .get('/admin/')
      .end(function(err, res) {
        res.should.have.status(401);
        done();
      });
  });

  it('should prevent access for logged non-admin user');

  it('should display admin page for admin user');
});
