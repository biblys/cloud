const express = require('express');
const router  = express.Router();
const config  = require('../config.js');

const Invoice = require('../models/invoice');

router.get('/:id', function(request, response, next) {

  Invoice.findById(request.params.id, function(err, invoice) {

    if (invoice === null) {
      next(err);
      return;
    }

    response.render('invoice', {
      invoice: invoice,
      stripe_public_key: config.STRIPE_PUBLIC_KEY
    });

  });

});

router.post('/:id/process-payment', function(request, response, next) {

  Invoice.findById(request.params.id, function(err, invoice) {

    if (invoice === null) {
      next(err);
      return;
    }

    // Get stripe key from config and token from request
    const stripe = require('stripe')(config.STRIPE_SECRET_KEY),
      token = request.body.stripeToken;

    stripe.charges.create({
      amount: invoice.amount,
      currency: 'eur',
      description: `Facture n° ${invoice.number}`,
      source: token,
    }, function(err) {

      if (err) {
        next(err);
        return;
      }

      // Todo: update invoice.payed & invoice.payedAt

      response.redirect(`/invoices/${invoice._id}`);
    });

  });

});

module.exports = router;
