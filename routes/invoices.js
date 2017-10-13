const express = require('express');
const router = express.Router();
const config = require('../config.js');

const Invoice = require('../models/invoice');

router.get('/:id', function(request, response, next) {
  response.render('invoice', {
    invoice: {
      id: request.params.id,
      name: 'Le Bélial',
      email: 'contact@belial.fr',
      amount: '999',
    },
    stripe_public_key: config.STRIPE_PUBLIC_KEY
  });
});

module.exports = router;
