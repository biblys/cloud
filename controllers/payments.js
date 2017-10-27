const express = require('express');
const router  = express.Router();
const config  = require('../config.js');

const Invoice = require('../models/invoice');
const Payment = require('../models/payment');

const auth      = require('../middlewares/auth');
const authAdmin = require('../middlewares/authAdmin');

// Create a new payment

router.post('/create', auth, function(request, response, next) {

  Invoice.findById(request.body.invoiceId).populate('customer').exec().then((invoice) => {

    if (invoice === null) {
      response.status(400);
      return next('No invoice with that id');
    }

    // If Invoice is not for this user
    if (!invoice.customer._id.equals(response.locals.customer._id) && !response.locals.customer.isAdmin) {
      response.status(403);
      return next('You are not authorized to pay for this invoice.');
    }

    if (typeof request.body.stripeToken === 'undefined') {
      response.status(400);
      return next('Stripe token not provided.');
    }

    this.invoice = invoice;

    // Get Stripe key from config and token from request
    const stripe = require('stripe')(config.STRIPE_SECRET_KEY);
    const token = request.body.stripeToken;

    // Get Stripe to charge card
    return stripe.charges.create({
      amount: invoice.amount,
      currency: 'eur',
      description: `Facture n° ${invoice.number}`,
      source: token
    });

  }).then((charge) => {

    // Create payment
    const payment = new Payment({
      invoice:  request.body.invoiceId,
      customer: response.locals.customer._id,
      amount:   charge.amount
    });
    return payment.save();

  }).then(() => {

    // Update invoice.payed & invoice.payedAt
    this.invoice.payed   = true;
    this.invoice.payedAt = Date.now();
    return this.invoice.save();

  }).then((invoice) => {

    // Redirect to payement page
    response.redirect(`/invoices/${invoice._id}`);

  }).catch(function(error) {
    return next(error);
  });

});

// List all invoices (admin)
router.get('/', auth, authAdmin, function(request, response, next) {

  Payment.find({}).populate('customer').populate('invoice').exec().then(function(payments) {
    response.render('payments/list', { payments: payments });
  }).catch((err) => next(err));

});

module.exports = router;
