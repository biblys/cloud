'use strict';

const express = require('express');
const router  = express.Router();

const User     = require('../models/user');
const Customer = require('../models/customer');

const auth      = require('../middlewares/auth');
const authAdmin = require('../middlewares/authAdmin');

// New

router.get('/new', auth, authAdmin, function(request, response,next) {
  Customer.find({}).exec().then(function(customers) {
    response.render('users/new', { customers });
  }).catch(function(err) {
    return next(err);
  });
});

// Create

router.post('/create', auth, authAdmin, function(request, response, next) {

  if (typeof request.body.axysId === 'undefined') {
    response.status(400);
    return next('Le champ ID Axys est obligatoire.');
  }

  if (typeof request.body.name === 'undefined') {
    response.status(400);
    return next('Le champ Nom est obligatoire.');
  }

  if (typeof request.body.email === 'undefined') {
    response.status(400);
    return next('Le champ E-mail est obligatoire.');
  }

  const user = new User({
    axysId:   request.body.axysId,
    name:     request.body.name,
    email:    request.body.email,
    customer: request.body.customer,
    isAdmin: false
  });
  user.save().then(function() {
    response.redirect('/users/');
  }).catch(function(error) {
    return next(error);
  });
});

// List

router.get('/', auth, authAdmin, function(request, response, next) {

  User.find({}).exec().then(function(users) {
    response.render('users/list', { users });
  }).catch((err) => next(err));

});

// Edit

router.get('/:id/edit', auth, authAdmin, function(request, response, next) {

  (async () => {

    const user = await User.findById(request.params.id).populate('customer').exec();

    if (user === null) {
      response.status(404);
      throw 'User Not Found';
    }

    const customers = await Customer.find({}).exec();

    response.render('users/edit', { user, customers });

  })().catch((err) => next(err));

});

// Update

router.post('/:id/update', auth, authAdmin, function(request, response, next) {

  User.findById(request.params.id).exec().then(function(user) {

    if (user === null) {
      response.status(404);
      throw 'User Not Found';
    }

    if (typeof request.body.axysId === 'undefined') {
      response.status(400);
      throw 'Le champ ID Axys est obligatoire.';
    }

    if (typeof request.body.name === 'undefined') {
      response.status(400);
      throw 'Le champ Nom est obligatoire.';
    }

    if (typeof request.body.email === 'undefined') {
      response.status(400);
      throw 'Le champ E-mail est obligatoire.';
    }

    user.axysId   = request.body.axysId;
    user.name     = request.body.name;
    user.email    = request.body.email;
    user.customer = request.body.customer;

    return user.save();

  }).then(function() {
    response.redirect('/users/');
  }).catch(function(error) {
    return next(error);
  });
});

module.exports = router;
