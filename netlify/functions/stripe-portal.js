const stripe = require('stripe')(process.env.STRIPE_KEY);

exports.handler = async function (event, context) {
  const params = event.queryStringParameters;
  const customerId = params.customer_id;

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: 'https://example.com/account',
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ url: session.url }),
  };
}
