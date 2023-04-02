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

    const { id, status, latest_invoice } = subscriptions.data[0];

    let isSubscriptionPaid = false;
    if (latest_invoice) {
      const invoice = await stripe.invoices.retrieve(latest_invoice);
      isSubscriptionPaid = invoice.paid;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ id, status, is_paid: isSubscriptionPaid }),
    };
  } catch (error) {
    return handleError(error);
  }
};
