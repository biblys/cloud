const express = require('express');
const router  = express.Router();
const config  = require('../config.js');
const stripe = require('stripe')(config.STRIPE_SECRET_KEY);

const Customer = require('../models/customer');
const Payment =  require('../models/payment');

const auth       = require('../middlewares/auth');
const authAdmin  = require('../middlewares/authAdmin');
const getInvoice = require('../middlewares/getInvoice');

// Create a new payment

router.post('/create', auth, getInvoice, function(request, response, next) {

  if (typeof request.body.stripeToken === 'undefined') {
    response.status(400);
    return next('Stripe token not provided.');
  }

  this.invoice = response.locals.invoice;

  // Create Stripe customer
  stripe.customers.create({
    email: this.invoice.customer.email,
    source: request.body.stripeToken
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
      customer: this.invoice.customer._id,
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
