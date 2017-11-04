'use strict';

// Authenticate
module.exports = function(request, response, next) {

  // User not logged in
  if (!response.locals.currentCustomer.isAdmin) {
    response.status(403);
    return next('For admin eyes only');
  }

  next();
};
