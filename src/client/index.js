import React from 'react';
import { render } from 'react-dom';

import InvoiceLines from './containers/InvoiceLines';
import Payments from './containers/Payments';
import CardForm from './components/CardForm';

// InvoiceLines element

const invoiceLinesElement = document.getElementById('invoice-lines');
if (invoiceLinesElement) {
  const invoiceId = invoiceLinesElement.dataset.invoiceId;
  const isAdmin = invoiceLinesElement.dataset.isAdmin == 'true';
  render(
    <InvoiceLines invoiceId={invoiceId} isAdmin={isAdmin} />,
    invoiceLinesElement
  );
}

// PaymentList element

const payments = document.getElementById('payments');
if (payments) {
  render(<Payments />, payments);
}

// CardForm element

const cardFormElement = document.getElementById('card-form');
if (cardFormElement) {
  const stripeKey = cardFormElement.dataset.stripeKey;
  const amount = cardFormElement.dataset.amount;
  const invoiceId = cardFormElement.dataset.invoiceId;
  render(
    <CardForm stripeKey={stripeKey} invoiceId={invoiceId} amount={amount} />,
    cardFormElement
  );
}

// Print button

const printButton = document.getElementById('print-button');
if (printButton) {
  printButton.addEventListener('click', () => window.print());
}
