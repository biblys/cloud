const { authenticate } = require('../../services/authenticator');
const HttpUnauthorizedError = require('../../errors/http-unauthorized-error');

module.exports = async function getPortalUrl(event, stripe) {
  try {
    const publicKey = authenticate(event.headers);
    const returnUrl = event.queryStringParameters.return_url;
    const session = await stripe.billingPortal.sessions.create({
      customer: publicKey,
      return_url: returnUrl,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({url: session.url}),
    };
  } catch (error) {
    if (error instanceof HttpUnauthorizedError) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Unauthorized' }),
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({error: error.message}),
    };
  }
};
