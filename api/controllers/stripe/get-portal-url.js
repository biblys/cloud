const { authenticate } = require('../../services/authenticator');
const { handleError } = require('../../services/error-handler');

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
    return handleError(error);
  }
};
