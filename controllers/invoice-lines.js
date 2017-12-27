'use strict';

const express = require('express');
const router  = express.Router({ mergeParams: true });

const auth       = require('../middlewares/auth');
const authAdmin  = require('../middlewares/authAdmin');
const getInvoice = require('../middlewares/getInvoice');

// List lines for an invoice

router.get('/', auth, getInvoice, async function(request, response) {

  response.send(request.invoice.lines);

});

// Create

router.post('/', auth, authAdmin, getInvoice, function(request, response, next) {

  if (typeof request.body.label === 'undefined') {
    response.status(400);
    return next('Le champ Label est obligatoire');
  }

  const invoice = request.invoice;

  invoice.lines.push({ label: request.body.label });

  invoice.save().then(function() {
    response.status(201).send();
  }).catch(function(error) {
    return next(error);
  });
});

module.exports = router;
