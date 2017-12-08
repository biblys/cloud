'use strict';

const chai           = require('chai');
const chaiAsPromised = require('chai-as-promised');
const crypto         = require('crypto');

const stripe = require('../../lib/stripe-helper');

chai.use(chaiAsPromised);
chai.should();

describe('Stripe Helper', function() {

  // Create customer from token

  describe('Create customer from token', function() {

    it('should throw an error if not token was provided', function() {
      stripe.createCustomer().should.be.rejectedWith(Error);
    });

    it('should throw an error if not email was provided', function() {
      stripe.createCustomer({ token: 'token' }).should.be.rejectedWith(Error);
    });

    it('should create a customer with a valid token and email', async function() {
      const customer = await stripe.createCustomer({ token: 'tok_visa', email: 'customer@biblys.fr' });

      customer.should.have.property('id');
    });
  });

  // Add card to existing customer

  describe('Add card to existing customer', function() {

    it('should throw an error if customer was not provided', function() {
      stripe.addCard().should.be.rejectedWith(Error);
    });

    it('should throw an error if card token was not provided', function() {
      stripe.addCard({ customer: 'customer' }).should.be.rejectedWith(Error);
    });

    it('should add card if valid customer and card token are provided', async function() {
      const customer = await stripe.createCustomer({ token: 'tok_visa', email: 'customer@biblys.fr' });
      const card     = await stripe.addCard({ customer: customer.id, token: 'tok_visa_debit' });

      card.should.have.property('id');
    });
  });

  // Create charge from customer or card

  describe('Create charge from customer or card', function() {

    it('should throw an error if neither a customer nor a charge is provided', function() {
      stripe.charge({}).should.be.rejectedWith(Error,
        'Customer or source arguments must be provided');
    });

    it('should throw an error if amount was not provided', function() {
      stripe.charge({ customer: 'customer' }).should.be.rejectedWith(Error,
        'Amount argument must be provided');
    });

    it('should throw an error if description was not provided', function() {
      stripe.charge({ customer: 'customer', amount: 999 }).should.be.rejectedWith(Error,
        'Description argument must be provided');
    });

    it('should throw an error if invoiceId was not provided', function() {
      stripe.charge({ customer: 'customer', amount: 999, description: 'Facture' })
        .should.be.rejectedWith(Error, 'InvoiceId argument must be provided');
    });

    it('should create a charge with valid customer, amount and description', async function() {
      const customer = await stripe.createCustomer({ token: 'tok_visa', email: 'customer@biblys.fr' });
      const invoiceId = crypto.randomBytes(16).toString('hex');
      const charge   = await stripe.charge({ customer: customer.id, amount: 999,
        description: 'Facture n° 114', invoiceId });

      charge.should.have.property('id');
    });
  });

  describe('Get cards for a Stripe customer', function() {

    it('should throw an error if customer was not provided', function() {
      stripe.getCards().should.be.rejectedWith(Error);
    });

    it('should get Cards from a valid customer', async function() {
      const customer = await stripe.createCustomer({ token: 'tok_visa', email: 'customer@biblys.fr' });
      const cards    = await stripe.getCards(customer.id);

      cards.should.be.an('array');
    });
  });

});
