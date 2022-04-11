const HttpUnauthorizedError = require('../errors/http-unauthorized-error');

module.exports = {
  handleError: function handleError(error) {
    if (error instanceof HttpUnauthorizedError) {
      return {
        statusCode: 401,
        body: JSON.stringify({error: 'Unauthorized'}),
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({error: error.message}),
    };
  }
}
