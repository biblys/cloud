const HttpUnauthorizedError = require('../errors/http-unauthorized-error');

module.exports = {
  authenticate: function authenticate(headers) {
    const base64Credentials = headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [publicKey, secretKey] = credentials.split(':');

    if (!secretKey || secretKey !== process.env.BIBLYS_CLOUD_KEY) {
      throw new HttpUnauthorizedError();
    }

    return publicKey;
  }
};
