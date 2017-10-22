const express = require('express');
const router  = express.Router();
const config  = require('../config.js');

const Invoice = require('../models/invoice');
const Payment = require('../models/payment');

router.post('/create', function(request, response, next) {

  Invoice.findById(request.body.invoiceId, function(err, invoice) {

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
    }, function(err, charge) {

      if (err) return next(err);

      // Create payment
      const payment = new Payment({
        invoice:  invoice._id,
        customer: response.locals.customer._id,
        amount:   charge.amount
      });
      payment.save(function(err) {
        if (err) return next(err);

        // Update invoice.payed & invoice.payedAt
        invoice.payed   = true;
        invoice.payedAt = Date.now();
        invoice.save(function(err, invoice) {
          if (err) return next(err);

          // Redirect to payement page
          response.redirect(`/invoices/${invoice._id}`);
        });
      });

    });

  });

});

module.exports = router;
