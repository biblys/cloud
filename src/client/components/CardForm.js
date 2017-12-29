import React from 'react';
import { StripeProvider, Elements } from 'react-stripe-elements';
import PropTypes from 'prop-types';

import CheckoutForm from './CheckoutForm';

const cardForm = (props) => (
  <StripeProvider apiKey={props.stripeKey}>
    <Elements>
      <CheckoutForm invoiceId={props.invoiceId} amount={props.amount}/>
    </Elements>
  </StripeProvider>
);

cardForm.propTypes = {
  amount:    PropTypes.string.isRequired,
  invoiceId: PropTypes.string.isRequired,
  stripeKey: PropTypes.string.isRequired
};

export default cardForm;
