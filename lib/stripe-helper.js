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

  /**
   * Create a charge from a customer or a source
   */
  async charge({ customer, source, amount, description }) {

    if (typeof customer === 'undefined' && typeof source === 'undefined') {
      throw new Error('Customer or source arguments must be provded');
    }

    if (typeof amount === 'undefined') {
      throw new Error('Amount argument must be provided');
    }

    if (typeof description === 'undefined') {
      throw new Error('Description argument must be provided');
    }

    const currency = 'eur';

    return await stripe.charges.create({ customer, source, amount, description, currency });
  }
}

module.exports = new StripeHelper(stripe);
