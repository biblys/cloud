'use strict';

// Authenticate
module.exports = function(request, response, next) {

  // User not logged in
  if (!response.locals.customer.isAdmin) {
    const error = {
      message: 'For admin eyes only',
      status:  403
    };
    return next(error);
  }

  next();
};
