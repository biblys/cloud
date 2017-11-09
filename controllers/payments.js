const express = require('express');
const router  = express.Router();
const config  = require('../config.js');
const stripe = require('stripe')(config.STRIPE_SECRET_KEY);

const Customer = require('../models/customer');
const Invoice =  require('../models/invoice');
const Payment =  require('../models/payment');

const auth      = require('../middlewares/auth');
const authAdmin = require('../middlewares/authAdmin');

// Create a new payment

router.post('/create', auth, function(request, response, next) {

  Invoice.findById(request.body.invoiceId).populate('customer').exec().then((invoice) => {

    if (invoice === null) {
      response.status(400);
      throw 'No invoice with that id';
    }

    // If Invoice is not for this user
    if (!invoice.customer._id.equals(response.locals.currentUser.customer._id) && !response.locals.currentUser.isAdmin) {
      response.status(403);
      throw 'You are not authorized to pay for this invoice.';
    }

    if (typeof request.body.stripeToken === 'undefined') {
      response.status(400);
      throw 'Stripe token not provided.';
    }

    this.invoice = invoice;

    // Create Stripe customer
    return stripe.customers.create({
      email: invoice.customer.email,
      source: request.body.stripeToken
    });

  }).then((stripeCustomer) => {

    this.stripeCustomerId = stripeCustomer.id;

    // Get customer for current invoice
    return Customer.findById(this.invoice.customer._id).exec();

  }).then((customer) => {

    // Save stripeCustomerId to local customer
    customer.stripeCustomerId = this.stripeCustomerId;
    return customer.save();

  }).then((customer) => {

    // Get Stripe to charge card
    return stripe.charges.create({
      amount: this.invoice.amount,
      currency: 'eur',
      description: `Facture n° ${this.invoice.number}`,
      customer: customer.stripeCustomerId
    });

  }).then((charge) => {

    // Create payment
    const payment = new Payment({
      invoice:  request.body.invoiceId,
      customer: response.locals.currentCustomer._id,
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
