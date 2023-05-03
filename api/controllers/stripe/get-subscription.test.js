/* global jest, describe, it, expect */

const MockDate = require('mockdate');

const getSubscription = require('./get-subscription');

describe('getSubscription', () => {
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
      const response = await getSubscription(event);

      // then
      expect(response.statusCode).toBe(401);
      expect(response.body).toBe(JSON.stringify({ error: 'Unauthorized' }));
    });
  });

  describe('when secret key is valid', () => {
    describe('when there is no subscription', () => {
      it('returns an empty object', async () => {
        // given
        const event = _mockEventForAuthenticatedUser();
        const stripe = _mockStripeResponse({});

        // when
        const response = await getSubscription(event, stripe);

        // then
        expect(response.statusCode).toBe(200);
        expect(response.body).toBe(JSON.stringify({}));
      });
    });

    describe('when there is a subscription', () => {
      it('returns the subscription id and status', async () => {
        // given
        process.env.BIBLYS_CLOUD_KEY = 'secret_key';
        const event = _mockEventForAuthenticatedUser();
        const stripe = _mockStripeResponse({ subscription: {
            id: 1,
            status: 'active',
            days_until_due: 7,
            current_period_end: 123456789,
            latest_invoice: null,
          }});

        // when
        const response = await getSubscription(event, stripe);

        // then
        expect(stripe.subscriptions.list).toHaveBeenCalledWith({ customer: 'public_key', limit: 1 });
        expect(response.statusCode).toBe(200);
        expect(response.body).toBe(JSON.stringify({
          id: 1,
          status: 'active',
          is_paid: true,
        }));
      });
    });
  });
});

function _mockEventForAuthenticatedUser() {
  process.env.BIBLYS_CLOUD_KEY = 'secret_key';
  const credentials = 'public_key:secret_key';
  const encodedCredentials = Buffer.from(credentials, 'ascii').toString('base64');
  return {
    headers: {
      authorization: `Bearer ${encodedCredentials}`,
    },
    queryStringParameters: {
      return_url: 'https://example.org/return-url',
    },
  };
}

function _mockStripeResponse({ subscription }) {
  const subscriptions = subscription ? [subscription] : [];
  return {
    subscriptions: {
      list: jest.fn(() => Promise.resolve({
        data: subscriptions,
      })),
    },
  };
}
