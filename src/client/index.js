import React from 'react';
import { render } from 'react-dom';

import InvoiceLines from './containers/InvoiceLines';
import CardForm from './components/CardForm';

// InvoiceLines element

const invoiceLinesElement = document.getElementById('invoice-lines');
if (invoiceLinesElement) {
  const invoiceId = invoiceLinesElement.dataset.invoiceId;
  const isAdmin = (invoiceLinesElement.dataset.isAdmin == 'true');
  render(<InvoiceLines invoiceId={invoiceId} isAdmin={isAdmin} />, invoiceLinesElement);
}

// CardForm element

const cardFormElement = document.getElementById('card-form');
if (cardFormElement) {
  const stripeKey = cardFormElement.dataset.stripeKey;
  const amount    = cardFormElement.dataset.amount;
  const invoiceId = cardFormElement.dataset.invoiceId;
  render(<CardForm stripeKey={stripeKey} invoiceId={invoiceId} amount={amount} />, cardFormElement);
}
