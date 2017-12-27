'use strict';

const express = require('express');
const router  = express.Router({ mergeParams: true });

const auth       = require('../middlewares/auth');
const getInvoice = require('../middlewares/getInvoice');

// List lines for an invoice

router.get('/', auth, getInvoice, async function(request, response) {

  response.send(request.invoice.lines);

});

module.exports = router;
