/* global Stripe */

import React from 'react';
import { render } from 'react-dom';

import InvoiceLines from './containers/InvoiceLines';
import Payments from './containers/Payments';

// InvoiceLines element

const invoiceLinesElement = document.getElementById('invoice-lines');
if (invoiceLinesElement) {
  const invoiceId = invoiceLinesElement.dataset.invoiceId;
  const isAdmin = invoiceLinesElement.dataset.isAdmin == 'true';
  render(
    <InvoiceLines invoiceId={invoiceId} isAdmin={isAdmin} />,
    invoiceLinesElement,
  );
}

// PaymentList element

const payments = document.getElementById('payments');
if (payments) {
  render(<Payments />, payments);
}

// Print button

const printButton = document.getElementById('print-button');
if (printButton) {
  printButton.addEventListener('click', () => window.print());
}

// Stripe Checkout

const payButton = document.getElementById('pay-button');
if (payButton) {
  payButton.addEventListener('click', () => {
    const { stripePublicKey, checkoutSessionId } = payButton.dataset;
    const stripe = Stripe(stripePublicKey);
    stripe
      .redirectToCheckout({
        sessionId: checkoutSessionId,
      })
      .then(result => {
        alert(result.error.message);
      });
  });
}
