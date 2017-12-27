'use strict';

const chai     = require('chai');
const chaiHttp = require('chai-http');
const server   = require('../../bin/www');
const mongoose = require('mongoose');

chai.should();
chai.use(chaiHttp);

const { user, admin, customerInvoice, otherInvoice } = require('../test-data.js');

describe('InvoiceLines controller', function() {

  // GET /invoices/:id/lines

  describe('GET /invoices/:id/lines', function() {

    it('should return 401 for unlogged user', function(done) {
      chai.request(server)
        .get('/invoices/xxx/lines')
        .end(function(err, res) {
          res.should.have.status(401);
          res.should.be.html;
          res.text.should.include('Connexion');
          done();
        });
    });

    it('should return 404 for non existing invoice', function(done) {
      chai.request(server)
        .get(`/invoices/${mongoose.Types.ObjectId()}/lines`)
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
        .get(`/invoices/${otherInvoice._id}/lines`)
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
        .get(`/invoices/${customerInvoice._id}/lines`)
        .set('Cookie', `userUid=${user.axysSessionUid}`)
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body[0].should.have.property('label');
          done();
        });
    });

    it('should allow admin to access all invoices lines', function(done) {
      chai.request(server)
        .get(`/invoices/${customerInvoice._id}/lines`)
        .set('Cookie', `userUid=${admin.axysSessionUid}`)
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body[0].should.have.property('label');
          done();
        });
    });
  });

});
