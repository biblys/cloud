const express = require('express');
const router  = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const Customer = require('../models/customer');
const Payment =  require('../models/payment');

const auth       = require('../middlewares/auth');
const authAdmin  = require('../middlewares/authAdmin');
const getInvoice = require('../middlewares/getInvoice');

// Create a new payment

router.post('/create', auth, getInvoice, async function(request, response, next) {

  if (typeof request.body.stripeToken === 'undefined') {
    response.status(400);
    return next('Stripe token not provided.');
  }

  const invoice = request.invoice;

  try {

    // Create Stripe customer
    const stripeCustomer = await stripe.customers.create({
      email: invoice.customer.email,
      source: request.body.stripeToken
    });

    // Get customer for current invoice
    const customer = await Customer.findById(invoice.customer._id).exec();

    // Save stripeCustomerId to local customer
    customer.stripeCustomerId = stripeCustomer.id;
    await customer.save();

    // Get Stripe to charge card
    const charge = await stripe.charges.create({
      amount: invoice.amount,
      currency: 'eur',
      description: `Facture n° ${invoice.number}`,
      customer: customer.stripeCustomerId
    });

    // Create payment
    const payment = new Payment({
      invoice:  request.body.invoiceId,
      user:     response.locals.currentUser._id,
      customer: invoice.customer._id,
      amount:   charge.amount
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
