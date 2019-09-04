'use strict';

const express = require('express');
const router = express.Router();
const stripe = require('../lib/stripe-helper');

const Customer = require('../models/customer');
const Invoice = require('../models/invoice');

const auth = require('../middlewares/auth');
const authAdmin = require('../middlewares/authAdmin');
const getInvoice = require('../middlewares/getInvoice');

const invoiceLines = require('./invoiceLines');
router.use('/:id/lines', invoiceLines);

// New

router.get('/new', auth, authAdmin, function(request, response, next) {
  Customer.find({})
    .exec()
    .then(function(customers) {
      response.render('invoices/new', { customers: customers });
    })
    .catch(function(err) {
      return next(err);
    });
});

// Create

router.post('/create', auth, authAdmin, function(request, response, next) {
  if (typeof request.body.number === 'undefined') {
    response.status(400);
    return next('Le champ numéro est obligatoire.');
  }

  if (typeof request.body.customer === 'undefined') {
    response.status(400);
    return next('Le champ client est obligatoire.');
  }

  if (typeof request.body.customerAddress === 'undefined') {
    response.status(400);
    return next('Le champ Adresse du client est obligatoire.');
  }

  if (typeof request.body.date === 'undefined') {
    response.status(400);
    return next('Le champ Date est obligatoire.');
  }

  const invoice = new Invoice({
    number: request.body.number,
    customer: request.body.customer,
    customerAddress: request.body.customerAddress,
    date: request.body.date,
    amount: request.body.amount,
    payed: false,
  });
  invoice
    .save()
    .then(function(invoice) {
      response.redirect(`/invoices/${invoice._id}`);
    })
    .catch(function(error) {
      return next(error);
    });
});

// List

router.get('/', auth, authAdmin, function(request, response, next) {
  Invoice.find({})
    .sort('-date')
    .populate('customer')
    .exec()
    .then(function(invoices) {
      response.render('invoices/list', { invoices: invoices });
    })
    .catch(err => next(err));
});

// Show invoice

router.get('/:id', auth, getInvoice, function(request, response) {
  response.render('invoices/show');
});

// Edit invoice

router.get('/:id/edit', auth, authAdmin, getInvoice, async function(
  request,
  response,
) {
  const customers = await Customer.find({});
  response.render('invoices/edit', { customers });
});

// Update

router.post('/:id/update', auth, authAdmin, getInvoice, async function(
  request,
  response,
  next,
) {
  try {
    if (typeof request.body.number === 'undefined') {
      response.status(400);
      throw 'Le champ Numéro est obligatoire.';
    }

    if (typeof request.body.customer === 'undefined') {
      response.status(400);
      throw 'Le champ Client est obligatoire.';
    }

    if (typeof request.body.customerAddress === 'undefined') {
      response.status(400);
      throw 'Le champ Adresse du client est obligatoire.';
    }

    if (typeof request.body.date === 'undefined') {
      response.status(400);
      throw 'Le champ Date est obligatoire.';
    }

    request.invoice.number = request.body.number;
    request.invoice.customer = request.body.customer;
    request.invoice.customerAddress = request.body.customerAddress;
    request.invoice.date = request.body.date;

    await request.invoice.save();
  } catch (error) {
    return next(error);
  }

  response.redirect(`/invoices/${request.invoice.id}/`);
});

// Pay invoice

router.get('/:id/pay', auth, getInvoice, function(request, response, next) {
  (async function() {
    const { protocol, invoice } = request;
    const returnUrl = `${protocol}://${request.get('host')}/`;
    const session = await stripe.createCheckoutSession(
      invoice.customer,
      invoice.lines,
      returnUrl,
    );
    response.render('invoices/pay', {
      checkoutSessionId: session.id,
      stripePublicKey: process.env.STRIPE_PUBLIC_KEY,
      iban: process.env.IBAN,
    });
  })().catch(error => next(error));
});

// Delete invoice

router.post('/:id/delete', auth, authAdmin, getInvoice, function(
  request,
  response,
  next,
) {
  Invoice.remove({ _id: request.invoice._id })
    .exec()
    .then(function() {
      response.redirect('/invoices/');
    })
    .catch(function(error) {
      return next(error);
    });
});

module.exports = router;
