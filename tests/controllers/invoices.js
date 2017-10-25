'use strict';

const chai     = require('chai');
const chaiHttp = require('chai-http');
const server   = require('../../bin/www');

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
      payed: false,
      customer: 'none'
    });

    otherInvoice = new Invoice({
      number: 1235,
      amount: 999,
      payed: false,
      customer: 'none'
    });

    customer.save().then(function() {
      return admin.save();
    }).then(function() {
      customerInvoice.customer = customer._id;
      return customerInvoice.save();
    }).then(function() {
      otherInvoice.customer = customer._id;
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

  describe('GET /invoices/xxx', function() {

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

    // it('should return 403 for unauthorized user', function(done) {
    //   chai.request(server)
    //     .get(`/invoices/${otherInvoice._id}`)
    //     .set('Cookie', `userUid=${customer.axysSessionUid}`)
    //     .end(function(err, res) {
    //       res.should.have.status(403);
    //       res.should.be.html;
    //       res.text.should.include('You are not authorized to see this invoice.');
    //       done();
    //     });
    // });

    it('should display invoice for authorized user');
    it('should allow admin to access all invoices');
  });
});
