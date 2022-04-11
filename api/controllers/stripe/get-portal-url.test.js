const getPortalUrl = require('./get-portal-url');

const stripe = {
  billingPortal: {
    sessions: {
      create: jest.fn(() => Promise.resolve({ url: 'https://stripe.com/portal-url' })),
    }
  }
};

describe('getPortalUrl', () => {
  describe('when secret key is invalid', () => {
    it('returns a 401 error', async () => {
      // given
      process.env.BIBLYS_CLOUD_KEY = 'secret_key';
      const credentials = 'public_key:invalid_secret_key';
      const encodedCredentials = Buffer.from(credentials, 'ascii').toString('base64');
      const event = {
        headers: {
          authorization: `Bearer ${encodedCredentials}`,
        },
      };

      // when
      const response = await getPortalUrl(event, stripe);

      // then
      expect(response.statusCode).toBe(401);
      expect(response.body).toBe(JSON.stringify({ error: 'Unauthorized' }));
    });
  });

  describe('when secret key is valid', () => {
    it('returns the portal url', async () => {
      // given
      process.env.BIBLYS_CLOUD_KEY = 'secret_key';
      const credentials = 'public_key:secret_key';
      const encodedCredentials = Buffer.from(credentials, 'ascii').toString('base64');
      const event = {
        headers: {
          authorization: `Bearer ${encodedCredentials}`,
        },
        queryStringParameters: {
          return_url: 'https://example.org/return-url',
        },
      };

      // when
      const response = await getPortalUrl(event, stripe);

      // then
      expect(response.statusCode).toBe(200);
      expect(response.body).toBe(JSON.stringify({ url: 'https://stripe.com/portal-url' }));
    });
  });
});

