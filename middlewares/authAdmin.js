'use strict';

// Authenticate
module.exports = function(request, response, next) {

  // User not logged in
  if (!response.locals.customer.isAdmin) {
    const error = new Error('For admin eyes only');
    error.status = 403;
    return next(error);
  }

  next();
};
