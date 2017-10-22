const express = require('express');
const router  = express.Router();
const config  = require('../config.js');

const Invoice = require('../models/invoice');
const Payment = require('../models/payment');

router.get('/:id', function(request, response, next) {

  Invoice.findById(request.params.id).populate('customer').exec(function(err, invoice) {

    if (invoice === null) {
      const err = new Error('Invoice Not Found');
      err.status = 404;
      next(err);
      return;
    }

    // If Invoice is not for this user
    if (!invoice.customer._id.equals(response.locals.customer._id) && !response.locals.customer.isAdmin) {
      const err = new Error('You are not authorized to see this invoice.');
      err.status = 403;
      next(err);
      return;
    }

    response.render('invoice', {
      invoice: invoice,
      stripe_public_key: config.STRIPE_PUBLIC_KEY
    });

  });

});

module.exports = router;
