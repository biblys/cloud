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

    // Get Stripe key from config and token from request
    const stripe = require('stripe')(config.STRIPE_SECRET_KEY),
      token = request.body.stripeToken;

    // Get Stripe to charge card
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

      // Update invoice.payed & invoice.payedAt
      invoice.payed   = true;
      invoice.payedAt = Date.now();
      invoice.save(function(err, invoice) {
        if (err) {
          next(err);
          return;
        }

        // Redirect to payement page
        response.redirect(`/invoices/${invoice._id}`);
      });

    });

  });

});

module.exports = router;
