'use strict';

const Invoice = require('../models/invoice');

// Identify user from Axys session UID
module.exports = function(request, response, next) {

  if (typeof request.params.id === 'undefined') {
    return next();
  }

  Invoice.findById(request.params.id).populate('customer').exec().then(function(invoice) {

    if (invoice === null) {
      response.status(404);
      throw 'Invoice Not Found';
    }

    // If Invoice is not for this user
    if (!invoice.customer._id.equals(response.locals.currentCustomer._id) && !response.locals.currentCustomer.isAdmin) {
      response.status(403);
      throw 'You are not authorized to see this invoice.';
    }

    request.invoice = invoice;
    response.locals.invoice = invoice;

    return next();
  }).catch(function(error) {
    return next(error);
  });
};
