'use strict';

require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class StripeHelper {
  constructor(stripe) {
    this.stripe = stripe;
  }

  /**
   * Create a Checkout session
   */
  async createCheckoutSession() {
    return await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          name: 'Abonnement Biblys (août 2019)',
          amount: 3000,
          currency: 'eur',
          quantity: 1,
        },
        {
          name: '3 journée de développement',
          amount: 45000,
          currency: 'eur',
          quantity: 1,
        },
      ],
      success_url: 'https://biblys.cloud/success',
      cancel_url: 'https://biblys.cloud/cancel',
    });
  }

  /**
   * Create a customer from token and email
   */
  async createCustomer({ token, email }) {
    if (typeof token === 'undefined') {
      throw new Error('Token argument must be provided');
    }

    if (typeof email === 'undefined') {
      throw new Error('Email argument must be provided');
    }

    return await stripe.customers.create({
      email: email,
      source: token,
    });
  }

  /**
   * Add a card to an existing customer
   * @param customer: Stripe customer id
   * @param token:    Stripe card token
   */
  async addCard({ customer, token }) {
    if (typeof customer === 'undefined') {
      throw new Error('Customer argument must be provided');
    }

    if (typeof token === 'undefined') {
      throw new Error('Card token argument must be provided');
    }

    return await stripe.customers.createSource(customer, {
      source: token,
    });
  }

  /**
   * Delete a customer's card
   */
  async deleteCard({ customer, card }) {
    if (typeof customer === 'undefined') {
      throw new Error('Customer argument must be provided');
    }

    if (typeof card === 'undefined') {
      throw new Error('Card argument must be provided');
    }

    return await stripe.customers.deleteSource(customer, card);
  }

  /**
   * Create a charge from a customer or a source
   * @param customer:    Stripe customer id
   * @param source:      Stripe card id
   * @param amount:      Charge amount in cents
   * @param description: Charge description
   */
  async charge({ customer, source, amount, description, invoiceId }) {
    if (typeof customer === 'undefined' && typeof source === 'undefined') {
      throw new Error('Customer or source arguments must be provided');
    }

    if (typeof amount === 'undefined') {
      throw new Error('Amount argument must be provided');
    }

    if (typeof description === 'undefined') {
      throw new Error('Description argument must be provided');
    }

    if (typeof invoiceId === 'undefined') {
      throw new Error('InvoiceId argument must be provided');
    }

    const currency = 'eur';

    return await stripe.charges.create(
      { customer, source, amount, description, currency },
      { idempotency_key: invoiceId },
    );
  }

  /**
   * Return cards for a Stripe Customer
   * @param customer: Stripe customer id
   * @return Array of cards
   */
  async getCards(customer) {
    if (typeof customer === 'undefined') {
      throw new Error('Customer argument must be provided');
    }

    const res = await stripe.customers.listSources(customer);
    return res.data;
  }
}

module.exports = new StripeHelper(stripe);
