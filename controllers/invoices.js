'use strict';

const express = require('express');
const router  = express.Router();
const config  = require('../config.js');

const Customer = require('../models/customer');
const Invoice  = require('../models/invoice');

const auth      = require('../middlewares/auth');
const authAdmin = require('../middlewares/authAdmin');

// New
router.get('/new', auth, authAdmin, function(request, response, next) {

  Customer.find({}).exec().then(function(customers) {
    response.render('invoices/new', { customers: customers });
  }).catch(function(err) {
    return next(err);
  });

});

// Create
router.post('/create', auth, authAdmin, function(request, response, next) {

  if (typeof request.body.number === 'undefined') {
    response.status(400);
    return next('Le champ numéro est obligatoire.');
  }

  if (typeof request.body.customer === 'undefined') {
    response.status(400);
    return next('Le champ client est obligatoire.');
  }

  if (typeof request.body.amount === 'undefined') {
    response.status(400);
    return next('Le champ montant est obligatoire.');
  }

  const invoice = new Invoice({
    number: request.body.number,
    customer: request.body.customer,
    amount: request.body.amount,
    payed: false
  });
  invoice.save().then(function(invoice) {
    response.redirect(`/invoices/${invoice._id}`);
  }).catch(function(error) {
    return next(error);
  });

});

// List
router.get('/', auth, authAdmin, function(request, response, next) {

  Invoice.find({}).populate('customer').exec().then(function(invoices) {
    response.render('invoices/list', { invoices: invoices });
  }).catch((err) => next(err));

});

// Show
router.get('/:id', auth, function(request, response, next) {

  Invoice.findById(request.params.id).populate('customer').exec(function(err, invoice) {

    if (invoice === null) {
      response.status(404);
      return next('Invoice Not Found');
    }

    // If Invoice is not for this user
    if (!invoice.customer._id.equals(response.locals.customer._id) && !response.locals.customer.isAdmin) {
      response.status(403);
      return next('You are not authorized to see this invoice.');
    }

    response.render('invoices/show', {
      invoice: invoice,
      stripePublicKey: config.STRIPE_PUBLIC_KEY,
      iban: config.IBAN
    });

  });

});

// ShowDelete
router.post('/:id/delete', auth, authAdmin, function(request, response, next) {

  Invoice.findById(request.params.id).exec().then(function(invoice) {

    if (invoice === null) {
      response.status(404);
      throw 'Invoice Not Found';
    }

    return Invoice.remove({ _id: invoice._id }).exec();

  }).then(function() {
    response.redirect('/invoices/');
  }).catch(function(error) {
    return next(error);
  });
});

module.exports = router;
