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
        .set('Accept', 'application/json')
        .end(function(err, res) {
          res.should.have.status(401);
          res.should.be.json;
          res.body.error.should.equal('Unauthorized');
          done();
        });
    });

    it('should return 404 for non existing invoice', function(done) {
      chai.request(server)
        .get(`/invoices/${mongoose.Types.ObjectId()}/lines`)
        .set('Accept', 'application/json')
        .set('Cookie', `userUid=${user.axysSessionUid}`)
        .end(function(err, res) {
          res.should.have.status(404);
          res.should.be.json;
          res.body.error.should.equal('Invoice Not Found');
          done();
        });
    });

    it('should return 403 for unauthorized user', function(done) {
      chai.request(server)
        .get(`/invoices/${otherInvoice._id}/lines`)
        .set('Accept', 'application/json')
        .set('Cookie', `userUid=${user.axysSessionUid}`)
        .end(function(err, res) {
          res.should.have.status(403);
          res.should.be.json;
          res.body.error.should.equal('You are not authorized to see this invoice.');
          done();
        });
    });

    it('should display invoice for authorized user', function(done) {
      chai.request(server)
        .get(`/invoices/${customerInvoice._id}/lines`)
        .set('Accept', 'application/json')
        .set('Cookie', `userUid=${user.axysSessionUid}`)
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body[0].should.have.property('_id');
          res.body[0].should.have.property('label');
          res.body[0].should.have.property('price');
          done();
        });
    });

    it('should allow admin to access all invoices lines', function(done) {
      chai.request(server)
        .get(`/invoices/${customerInvoice._id}/lines`)
        .set('Accept', 'application/json')
        .set('Cookie', `userUid=${admin.axysSessionUid}`)
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body[0].should.have.property('_id');
          res.body[0].should.have.property('label');
          res.body[0].should.have.property('price');
          done();
        });
    });
  });

  // POST /invoices/:id/lines

  describe('POST /invoices/:id/lines', function() {
    it('should return 401 for unlogged user', function(done) {
      chai.request(server)
        .post(`/invoices/${customerInvoice._id}/lines`)
        .set('Accept', 'application/json')
        .end(function(err, res) {
          res.should.have.status(401);
          res.should.be.json;
          res.body.error.should.equal('Unauthorized');
          done();
        });
    });

    it('should return 403 for non admin user', function(done) {
      chai.request(server)
        .post(`/invoices/${customerInvoice._id}/lines`)
        .set('Accept', 'application/json')
        .set('Cookie', `userUid=${user.axysSessionUid}`)
        .end(function(err, res) {
          res.should.have.status(403);
          res.should.be.json;
          res.body.error.should.equal('For admin eyes only');
          done();
        });
    });

    it('should return 404 if invoice id is unknown', function(done) {
      chai.request(server)
        .post(`/invoices/${mongoose.Types.ObjectId()}/lines`)
        .set('Cookie', `userUid=${admin.axysSessionUid}`)
        .set('Accept', 'application/json')
        .end(function(err, res) {
          res.should.have.status(404);
          res.should.be.json;
          res.body.error.should.equal('Invoice Not Found');
          done();
        });
    });

    it('should return 400 if label field is missing', function(done) {
      chai.request(server)
        .post(`/invoices/${customerInvoice._id}/lines`)
        .set('Cookie', `userUid=${admin.axysSessionUid}`)
        .set('Accept', 'application/json')
        .end(function(err, res) {
          res.should.have.status(400);
          res.should.be.json;
          res.body.error.should.equal('Le champ Label est obligatoire');
          done();
        });
    });

    it('should return 400 if price field is missing', function(done) {
      chai.request(server)
        .post(`/invoices/${customerInvoice._id}/lines`)
        .set('Cookie', `userUid=${admin.axysSessionUid}`)
        .set('Accept', 'application/json')
        .send({ label: 'Line 1' })
        .end(function(err, res) {
          res.should.have.status(400);
          res.should.be.json;
          res.body.error.should.equal('Le champ Prix est obligatoire');
          done();
        });
    });

    it('should return 201 after invoice line creation', function(done) {
      chai.request(server)
        .post(`/invoices/${customerInvoice._id}/lines`)
        .set('Cookie', `userUid=${admin.axysSessionUid}`)
        .set('Accept', 'application/json')
        .send({ label: 'Line 1', price: '13.99' })
        .end(function(err, res) {
          res.should.have.status(201);
          res.body.should.have.property('_id');
          res.body.should.have.property('label');
          res.body.should.have.property('price');
          done();
        });
    });
  });

  // DELETE /invoices/:id/lines/:lineId

  describe('DELETE /invoices/:id/lines/:lineId', function() {
    it('should return 401 for unlogged user', function(done) {
      chai.request(server)
        .delete(`/invoices/${customerInvoice._id}/lines/${customerInvoice.lines[0]._id}`)
        .set('Accept', 'application/json')
        .end(function(err, res) {
          res.should.have.status(401);
          res.should.be.json;
          res.body.error.should.equal('Unauthorized');
          done();
        });
    });

    it('should return 403 for non admin user', function(done) {
      chai.request(server)
        .delete(`/invoices/${customerInvoice._id}/lines/${customerInvoice.lines[0]._id}`)
        .set('Accept', 'application/json')
        .set('Cookie', `userUid=${user.axysSessionUid}`)
        .end(function(err, res) {
          res.should.have.status(403);
          res.should.be.json;
          res.body.error.should.equal('For admin eyes only');
          done();
        });
    });

    it('should return 404 if invoice id is unknown', function(done) {
      chai.request(server)
        .delete(`/invoices/${mongoose.Types.ObjectId()}/lines/${mongoose.Types.ObjectId()}`)
        .set('Cookie', `userUid=${admin.axysSessionUid}`)
        .set('Accept', 'application/json')
        .end(function(err, res) {
          res.should.have.status(404);
          res.should.be.json;
          res.body.error.should.equal('Invoice Not Found');
          done();
        });
    });

    it('should return 404 if invoice line id is unknown', function(done) {
      chai.request(server)
        .delete(`/invoices/${customerInvoice._id}/lines/${mongoose.Types.ObjectId()}`)
        .set('Cookie', `userUid=${admin.axysSessionUid}`)
        .set('Accept', 'application/json')
        .end(function(err, res) {
          res.should.have.status(404);
          res.should.be.json;
          res.body.error.should.equal('Invoice Line Not Found');
          done();
        });
    });

    it('should return 204 after successful invoice line deletion', function(done) {
      chai.request(server)
        .delete(`/invoices/${customerInvoice._id}/lines/${customerInvoice.lines[0]._id}`)
        .set('Cookie', `userUid=${admin.axysSessionUid}`)
        .set('Accept', 'application/json')
        .end(function(err, res) {
          res.should.have.status(204);
          done();
        });
    });

  });
});
