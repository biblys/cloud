const stripe = require('stripe')(process.env.STRIPE_KEY);

exports.handler = async function (event) {
  const headers = event.headers;
  const base64Credentials =  headers.authorization.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [publicKey, secretKey] = credentials.split(':');

  if (!secretKey || secretKey !== process.env.BIBLYS_CLOUD_KEY) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized' }),
    };
  }

  const subscriptions = await stripe.subscriptions.list({
    customer: publicKey,
    status: 'active',
    limit: 1,
  });
  const { id, days_until_due, current_period_end } = subscriptions.data[0];

  return {
    statusCode: 200,
    body: JSON.stringify({ id, days_until_due, current_period_end }),
  };
}
