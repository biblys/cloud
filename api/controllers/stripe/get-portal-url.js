module.exports = async function getPortalUrl(event, stripe) {
  const headers = event.headers;
  const base64Credentials = headers.authorization.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [publicKey, secretKey] = credentials.split(':');

  if (!secretKey || secretKey !== process.env.BIBLYS_CLOUD_KEY) {
    return {
      statusCode: 401,
      body: JSON.stringify({error: 'Unauthorized'}),
    };
  }

  const returnUrl = event.queryStringParameters.return_url;
  const session = await stripe.billingPortal.sessions.create({
    customer: publicKey,
    return_url: returnUrl,
  });

  return {
    statusCode: 200,
    body: JSON.stringify({url: session.url}),
  };
};
