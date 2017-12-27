import React from 'react';
import { render } from 'react-dom';

import CardForm from './components/CardForm';

// CardForm element

const cardFormElement = document.getElementById('card-form');
if (cardFormElement) {
  const stripeKey = cardFormElement.dataset.stripeKey;
  const amount    = cardFormElement.dataset.amount;
  const invoiceId = cardFormElement.dataset.invoiceId;
  render(<CardForm stripeKey={stripeKey} invoiceId={invoiceId} amount={amount} />, cardFormElement);
}
