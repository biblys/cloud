const { authenticate } = require('../../services/authenticator');
const { handleError } = require('../../services/error-handler');

module.exports = async function getSubscription(event, stripe) {
  try {
    const publicKey = authenticate(event.headers);
    const subscriptions = await stripe.subscriptions.list({
      customer: publicKey,
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({}),
      };
    }

    const { id, status } = subscriptions.data[0];

    return {
      statusCode: 200,
      body: JSON.stringify({
        id,
        status,
      }),
    };
  } catch (error) {
    return handleError(error);
  }
};
