'use strict';

// Authenticate
module.exports = function(request, response, next) {

  // User not logged in
  if (typeof response.locals.currentUser === 'undefined') {
    if (request.accepts('json') && !request.accepts('html')) {
      return response.status(401).send({ error: 'Unauthorized' });
    }

    return response.status(401).render('login', { url: `${request.protocol}://${request.get('host')}${request.originalUrl}` });
  }

  next();
};
