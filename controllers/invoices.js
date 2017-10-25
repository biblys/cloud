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

// Show
router.get('/:id', auth, function(request, response, next) {

  Invoice.findById(request.params.id).populate('customer').exec(function(err, invoice) {

    if (invoice === null) {
      const err = new Error('Invoice Not Found');
      err.status = 404;
      return next(err);
    }

    // If Invoice is not for this user
    if (!invoice.customer._id.equals(response.locals.customer._id) && !response.locals.customer.isAdmin) {
      const err = new Error('You are not authorized to see this invoice.');
      err.status = 403;
      return next(err);
    }

    response.render('invoices/show', {
      invoice: invoice,
      stripePublicKey: config.STRIPE_PUBLIC_KEY,
      iban: config.IBAN
    });

  });

});

module.exports = router;
