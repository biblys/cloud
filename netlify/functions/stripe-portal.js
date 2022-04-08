const stripe = require('stripe')(process.env.STRIPE_KEY);

exports.handler = async function (event, context) {
  const headers = event.headers;
  if (!headers.key || headers.key !== process.env.BIBLYS_CLOUD_KEY) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized' }),
    };
  }

  const body = JSON.parse(event.body);
  const customerId = body.customer_id;
  const returnUrl = body.return_url;
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ url: session.url }),
  };
}
