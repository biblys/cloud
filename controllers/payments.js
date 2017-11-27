'use strict';

const express = require('express');
const router  = express.Router();
const stripe = require('../lib/stripe-helper');

const Customer = require('../models/customer');
const Payment =  require('../models/payment');

const auth       = require('../middlewares/auth');
const authAdmin  = require('../middlewares/authAdmin');
const getInvoice = require('../middlewares/getInvoice');

// Create a new payment

router.post('/create', auth, getInvoice, async function(request, response, next) {

  if (typeof request.body.stripeToken === 'undefined' && typeof request.body.stripeCard === 'undefined') {
    response.status(400);
    return next('Stripe card token or card id must be provided.');
  }

  const invoice = request.invoice;

  try {

    // Paying with a new card
    if (typeof request.body.stripeToken !== 'undefined') {

      // Get customer for current invoice
      const customer = await Customer.findById(invoice.customer._id).exec();

      // If customer already has a stripe id, use it to add card
      if (typeof customer.stripeCustomerId !== 'undefined') {

        // Add new card to Stripe customer
        const card = await stripe.addCard({
          customer: customer.stripeCustomerId,
          token: request.body.stripeToken
        });

        // Charge new card
        await stripe.charge({
          amount: invoice.amount,
          description: `Facture n° ${invoice.number}`,
          customer: customer.stripeCustomerId,
          source: card.id
        });
      }

      // Else create a Stripe customer and charge its default source
      else {

        // Create Stripe customer
        const stripeCustomer = await stripe.createCustomer({
          email: invoice.customer.email,
          token: request.body.stripeToken
        });

        // Save stripeCustomerId to local customer
        customer.stripeCustomerId = stripeCustomer.id;
        await customer.save();

        // Get Stripe to charge new customer default card
        await stripe.charge({
          amount: invoice.amount,
          description: `Facture n° ${invoice.number}`,
          customer: customer.stripeCustomerId
        });

      }

    // Paying with a saved card
    } else if (typeof request.body.stripeCard !== 'undefined') {

      // Get Stripe to charge saved card
      await stripe.charge({
        amount: invoice.amount,
        description: `Facture n° ${invoice.number}`,
        customer: invoice.customer.stripeCustomerId,
        source: request.body.stripeCard
      });

    }

    // Create payment
    const payment = new Payment({
      invoice:  request.body.invoiceId,
      user:     response.locals.currentUser._id,
      customer: invoice.customer._id,
      amount:   invoice.amount
    });
    await payment.save();

    // Update invoice.payed & invoice.payedAt
    invoice.payed   = true;
    invoice.payedAt = Date.now();
    await invoice.save();

    // Redirect to payement page
    return response.redirect(`/invoices/${invoice._id}`);

  } catch (error) {
    next(error);
  }

});

// List all invoices (admin)
router.get('/', auth, authAdmin, function(request, response, next) {

  Payment.find({}).populate('customer').populate('invoice').populate('user').exec().then(function(payments) {
    response.render('payments/list', { payments: payments });
  }).catch((err) => next(err));

});

module.exports = router;
