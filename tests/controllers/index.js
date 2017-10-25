'use strict';

const chai     = require('chai');
const chaiHttp = require('chai-http');
const server   = require('../../bin/www');

const Customer = require('../../models/customer');

chai.should();
chai.use(chaiHttp);

let customer;
let admin;

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

  customer.save().then(function() {
    return admin.save();
  }).then(function() {
    done();
  }).catch(function(error) {
    throw error;
  });
});

after(function(done) {
  Customer.collection.drop();
  server.close();
  done();
});

describe('GET /', function() {

  it('should display home page on / GET', function(done) {
    chai.request(server)
      .get('/')
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.html;
        res.text.should.include('Welcome to Biblys Cloud');
        done();
      });
  });
});

describe('GET /login', function() {
  it('should display login page', function(done) {
    chai.request(server)
      .get('/login')
      .end(function(err, res) {
        res.should.have.status(401);
        res.should.be.html;
        res.text.should.include('Connexion');
        done();
      });
  });
});

describe('GET /logout', function() {
  it('should display login page', function(done) {
    chai.request(server)
      .get('/logout')
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.redirect;
        done();
      });
  });
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

  it('should prevent access for logged non-admin user', function(done) {
    chai.request(server)
      .get('/admin/')
      .set('Cookie', `userUid=${customer.axysSessionUid}`)
      .end(function(err, res) {
        res.should.have.status(403);
        done();
      });
  });

  it('should display admin page for admin user', function(done) {
    chai.request(server)
      .get('/admin/')
      .set('Cookie', `userUid=${admin.axysSessionUid}`)
      .end(function(err, res) {
        res.should.have.status(200);
        res.text.should.include('Admin Dashboard');
        done();
      });
  });
});
