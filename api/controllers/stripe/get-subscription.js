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

      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).getTime();
      if (isSubscriptionPaid === false && invoice.date > sevenDaysAgo) {
        isSubscriptionPaid = true;
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ id, status, is_paid: isSubscriptionPaid }),
    };
  } catch (error) {
    return handleError(error);
  }
};
