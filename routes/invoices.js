const express = require('express');
const router = express.Router();
const config = require('../config.js');

const Invoice = require('../models/invoice');

router.get('/:id', function(request, response, next) {

  Invoice.findById(request.params.id, function(err, invoice) {

    if (invoice === null) {
      next(err);
      return;
    }

    response.render('invoice', {
      invoice: {
        number: invoice.number,
        name: invoice.name,
        email: invoice.email,
        amount: invoice.amount,
      },
      stripe_public_key: config.STRIPE_PUBLIC_KEY
    });

  });

});

module.exports = router;
