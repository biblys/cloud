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
        const stripe = {
          subscriptions: {
            list: jest.fn(() => Promise.resolve({
              data: []
            })),
          }
        };

        // when
        const response = await getSubscription(event, stripe);

        // then
        expect(response.statusCode).toBe(200);
        expect(response.body).toBe(JSON.stringify({}));
      });
    });

    describe('when there is a subscription', () => {
      describe('when there is no invoice', () => {
        it('returns the subscription', async () => {
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
          const stripe = {
            subscriptions: {
              list: jest.fn(() => Promise.resolve({
                data: [{
                  id: 1,
                  status: 'active',
                  days_until_due: 7,
                  current_period_end: 123456789,
                  latest_invoice: null,
                }]
              })),
            }
          };

          // when
          const response = await getSubscription(event, stripe);

          // then
          expect(stripe.subscriptions.list).toHaveBeenCalledWith({ customer: 'public_key', limit: 1 });
          expect(response.statusCode).toBe(200);
          expect(response.body).toBe(JSON.stringify({
            id: 1,
            status: 'active',
            is_paid: false,
          }));
        });
      });

      describe('when there is a latest invoice', () => {
        it('returns the subscription with invoice detail', async () => {
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
          const stripe = {
            subscriptions: {
              list: jest.fn(() => Promise.resolve({
                data: [{
                  id: 1,
                  status: 'active',
                  days_until_due: 7,
                  current_period_end: 123456789,
                  latest_invoice: 'invoice_123456789',
                }]
              })),
            },
            invoices: {
              retrieve: jest.fn(() => Promise.resolve({
                paid: true,
              })),
            }
          };

          // when
          const response = await getSubscription(event, stripe);

          // then
          expect(stripe.subscriptions.list).toHaveBeenCalledWith({ customer: 'public_key', limit: 1 });
          expect(stripe.invoices.retrieve).toHaveBeenCalledWith('invoice_123456789');
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
});

