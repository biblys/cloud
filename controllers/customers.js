'use strict';

const express = require('express');
const router  = express.Router();

const Customer = require('../models/customer');

const auth      = require('../middlewares/auth');
const authAdmin = require('../middlewares/authAdmin');

// New

router.get('/new', auth, authAdmin, function(request, response) {
  response.render('customers/new');
});

// Create

router.post('/create', auth, authAdmin, function(request, response, next) {

  if (typeof request.body.name === 'undefined') {
    response.status(400);
    return next('Le champ Nom est obligatoire.');
  }

  if (typeof request.body.email === 'undefined') {
    response.status(400);
    return next('Le champ E-mail est obligatoire.');
  }

  const customer = new Customer({
    name: request.body.name,
    email: request.body.email
  });
  customer.save().then(function() {
    response.redirect('/customers/');
  }).catch(function(error) {
    return next(error);
  });
});

// List

router.get('/', auth, authAdmin, function(request, response, next) {

  Customer.find({}).exec().then(function(customers) {
    response.render('customers/list', { customers: customers });
  }).catch((err) => next(err));

});

// Edit

router.get('/:id/edit', auth, authAdmin, function(request, response, next) {

  Customer.findById(request.params.id).exec().then(function(customer) {

    if (customer === null) {
      response.status(404);
      throw 'Customer Not Found';
    }

    response.render('customers/edit', { customer: customer });
  }).catch((err) => next(err));

});

// Update

router.post('/:id/update', auth, authAdmin, function(request, response, next) {

  Customer.findById(request.params.id).exec().then(function(customer) {

    if (customer === null) {
      response.status(404);
      throw 'Customer Not Found';
    }

    if (typeof request.body.name === 'undefined') {
      response.status(400);
      throw 'Le champ Nom est obligatoire.';
    }

    if (typeof request.body.email === 'undefined') {
      response.status(400);
      throw 'Le champ E-mail est obligatoire.';
    }

    customer.name   = request.body.name;
    customer.email  = request.body.email;

    return customer.save();

  }).then(function() {
    response.redirect('/customers/');
  }).catch(function(error) {
    return next(error);
  });
});

module.exports = router;
