const { authenticate } = require('../../services/authenticator');
const HttpUnauthorizedError = require('../../errors/http-unauthorized-error');

module.exports = async function getSubscription(event, stripe) {
  try {
    const publicKey = authenticate(event.headers);
    const subscriptions = await stripe.subscriptions.list({
      customer: publicKey,
      status: 'active',
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({}),
      };
    }

    const { id, days_until_due, current_period_end } = subscriptions.data[0];
    return {
      statusCode: 200,
      body: JSON.stringify({ id, days_until_due, current_period_end }),
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
      body: JSON.stringify({ error: error.message }),
    };
  }
};
