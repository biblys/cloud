'use strict';

const Invoice = require('../models/invoice');

// Identify user from Axys session UID
module.exports = function(request, response, next) {

  // Get invoice id from GET or POST param
  const invoiceId = request.params.id || request.body.invoiceId;

  if (typeof invoiceId === 'undefined') {
    return next();
  }

  Invoice.findById(invoiceId).populate('customer').exec().then(function(invoice) {

    if (invoice === null) {
      response.status(404);
      throw 'Invoice Not Found';
    }

    // If Invoice is not for this user
    if (!response.locals.currentUser.isAdmin && !invoice.customer._id.equals(response.locals.currentUser.customer._id)) {
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
