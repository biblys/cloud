'use strict';

require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class StripeHelper
{
  constructor(stripe) {
    this.stripe = stripe;
  }

  /**
   * Create a token from card info (test-only)
   */
  async createTokenFromCard(card) {

    if (typeof card === 'undefined') {
      throw new Error('Card argument must be provided');
    }

    return await this.stripe.tokens.create(card);
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
      source: token
    });
  }
}

module.exports = new StripeHelper(stripe);
