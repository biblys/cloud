'use strict';

// Authenticate
module.exports = function(request, response, next) {

  // User not logged in
  if (typeof response.locals.customer === 'undefined') {
    return response.render('login', { url: request.protocol + '://' + request.get('host') + request.originalUrl });
  }

  next();
};
