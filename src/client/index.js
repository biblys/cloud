import React from 'react';
import { render } from 'react-dom';
import { StripeProvider, Elements } from 'react-stripe-elements';
import PropTypes from 'prop-types';

import CheckoutForm from './components/CheckoutForm';

class CardForm extends React.Component {
  render() {
    return (
      <StripeProvider apiKey={this.props.stripeKey}>
        <Elements>
          <CheckoutForm invoiceId={this.props.invoiceId} amount={this.props.amount}/>
        </Elements>
      </StripeProvider>
    );
  }
}

CardForm.propTypes = {
  amount:    PropTypes.string.isRequired,
  invoiceId: PropTypes.string.isRequired,
  stripeKey: PropTypes.string.isRequired
};

const cardFormElement = document.getElementById('card-form');
if (cardFormElement) {
  const stripeKey = cardFormElement.dataset.stripeKey;
  const amount    = cardFormElement.dataset.amount;
  const invoiceId = cardFormElement.dataset.invoiceId;
  render(<CardForm stripeKey={stripeKey} invoiceId={invoiceId} amount={amount} />, cardFormElement);
}
