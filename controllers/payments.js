'use strict';

const express = require('express');
const router  = express.Router();
const stripe = require('../lib/stripe-helper');

const Customer = require('../models/customer');
const Invoice = require('../models/invoice');
const Payment  = require('../models/payment');

const auth       = require('../middlewares/auth');
const authAdmin  = require('../middlewares/authAdmin');
const getInvoice = require('../middlewares/getInvoice');

// New

router.get('/new', auth, authAdmin, async function(request, response, next) {

  try {

    // Get unpayed invoices
    const invoices = await Invoice.find({ payed: false }).exec();

    const methods = Payment.schema.path('method').enumValues;

    response.render('payments/new', { invoices, methods });
  } catch (e) {
    return next(e);
  }

});

// POST new Payment using admin form

router.post('/create-from-form', auth, authAdmin, getInvoice, async function(request, response, next) {

  if (typeof request.body.method === 'undefined' || request.body.method === '') {
    response.status(400);
    return next('Method must be provided.');
  }

  if (typeof request.body.date === 'undefined' || request.body.date === '') {
    response.status(400);
    return next('Date must be provided.');
  }

  try {
    const payment = new Payment();
    payment.user = request.currentUser._id;
    payment.customer = request.invoice.customer._id;
    payment.invoice = request.invoice._id;
    payment.amount = request.invoice.amount;
    payment.method = request.body.method;
    payment.date = request.body.date;
    await payment.save();

    request.invoice.payed = true;
    request.invoice.payedAt = request.body.date;
    await request.invoice.save();
  } catch (error) {
    return next(error);
  }

  response.redirect('/payments/');
});

// POST new Payment using Stripe

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
          source: card.id,
          invoiceId: invoice._id
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
          customer: customer.stripeCustomerId,
          invoiceId: invoice._id
        });

      }

    // Paying with a saved card
    } else if (typeof request.body.stripeCard !== 'undefined') {

      // Get Stripe to charge saved card
      await stripe.charge({
        amount: invoice.amount,
        description: `Facture n° ${invoice.number}`,
        customer: invoice.customer.stripeCustomerId,
        source: request.body.stripeCard,
        invoiceId: invoice._id
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

  Payment.find({}).sort('-createdAt').populate('customer').populate('invoice').populate('user').exec().then(function(payments) {
    response.render('payments/list', { payments: payments });
  }).catch((err) => next(err));

});

module.exports = router;
