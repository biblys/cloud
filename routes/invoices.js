var express = require('express');
var router = express.Router();
const config = require('./../config.js');

router.get('/:id', function(request, response, next) {
  response.render('invoice', {
    invoice: {
      id: request.params.id,
      email: 'cb@nokto.net',
      amount: '999',
    },
    stripe_public_key: config.STRIPE_PUBLIC_KEY
  });
});

module.exports = router;
