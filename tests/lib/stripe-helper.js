'use strict';

const chai           = require('chai');
const chaiAsPromised = require('chai-as-promised');

const stripe = require('../../lib/stripe-helper');

chai.use(chaiAsPromised);
chai.should();

const stripeCard = {
  card: {
    number: '4242424242424242',
    exp_month: 12,
    exp_year: 2021,
    cvc: '123'
  }
};

describe('Stripe Helper', function() {

  // Create token from card

  describe('Create token from card', function() {

    it('should throw an error if not card was provided', function() {
      stripe.createTokenFromCard().should.be.rejectedWith(Error);
    });

    it('should create a token from a valid card object', async function() {
      const token = await stripe.createTokenFromCard(stripeCard);

      token.should.have.property('id');
    });

  });

  // Create customer from token

  describe('Create customer from token', function() {

    it('should throw an error if not token was provided', function() {
      stripe.createCustomer().should.be.rejectedWith(Error);
    });

    it('should throw an error if not email was provided', function() {
      stripe.createCustomer({ token: 'token' }).should.be.rejectedWith(Error);
    });

    it('should create a customer with a valid token and email', async function() {
      const token    = await stripe.createTokenFromCard(stripeCard);
      const customer = await stripe.createCustomer({ token: token.id, email: 'customer@biblys.fr' });

      customer.should.have.property('id');
    });
  });

  describe('Create charge from customer or card', function() {

    it('should throw an error if neither a customer nor a charge is provided', function() {
      stripe.charge().should.be.rejectedWith(Error);
    });

    it('should throw an error if amount was not provided', function() {
      stripe.charge({ customer: 'customer' }).should.be.rejectedWith(Error);
    });

    it('should throw an error if description was not provided', function() {
      stripe.charge({ customer: 'customer', amount: 999 }).should.be.rejectedWith(Error);
    });

    it('should create a charge with valid customer, amount and description', async function() {
      const token    = await stripe.createTokenFromCard(stripeCard);
      const customer = await stripe.createCustomer({ token: token.id, email: 'customer@biblys.fr' });
      const charge   = await stripe.charge({ customer: customer.id, amount: 999, description: 'Facture n° 114' });

      charge.should.have.property('id');
    });
  });

  describe('Get cards for a Stripe customer', function() {

    it('should throw an error if customer was not provided', function() {
      stripe.getCards().should.be.rejectedWith(Error);
    });

    it('should get Cards from a valid customer', async function() {
      const token    = await stripe.createTokenFromCard(stripeCard);
      const customer = await stripe.createCustomer({ token: token.id, email: 'customer@biblys.fr' });
      const cards    = await stripe.getCards(customer.id);

      cards.should.be.an('array');
    });
  });

});
