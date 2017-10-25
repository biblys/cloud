const express = require('express');
const router  = express.Router();
const config  = require('../config.js');

const Invoice = require('../models/invoice');
const Payment = require('../models/payment');

const auth = require('../middlewares/auth');

router.post('/create', auth, function(request, response, next) {

  Invoice.findById(request.body.invoiceId).populate('customer').exec(function(err, invoice) {

    if (invoice === null) {
      const err = new Error('No invoice with that id');
      err.status = 400;
      return next(err);
    }

    // If Invoice is not for this user
    if (!invoice.customer._id.equals(response.locals.customer._id) && !response.locals.customer.isAdmin) {
      const err = new Error('You are not authorized to pay for this invoice.');
      err.status = 403;
      return next(err);
    }

    if (typeof request.body.stripeToken === 'undefined') {
      const err = new Error('Stripe token not provided.');
      err.status = 400;
      return next(err);
    }

    // Get Stripe key from config and token from request
    const stripe = require('stripe')(config.STRIPE_SECRET_KEY);
    const token = request.body.stripeToken;

    // Get Stripe to charge card
    stripe.charges.create({
      amount: invoice.amount,
      currency: 'eur',
      description: `Facture n° ${invoice.number}`,
      source: token
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
