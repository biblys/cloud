'use strict';

const chai     = require('chai');
const chaiHttp = require('chai-http');
const server   = require('../../bin/www');

chai.should();
chai.use(chaiHttp);

describe('GET /', function() {

  afterEach(function(done) {
    server.close();
    done();
  });

  it('should display home page on / GET', function(done) {
    chai.request(server)
      .get('/')
      .end(function(err, res) {
        res.should.have.status(200);
        done();
      });
  });

  it('should prevent access /admin/ for unlogged visitor', function(done) {
    chai.request(server)
      .get('/admin/')
      .end(function(err, res) {
        res.should.have.status(401);
        done();
      });
  });
});
