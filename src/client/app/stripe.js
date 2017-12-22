/* global Stripe */

'use strict';

document.addEventListener('DOMContentLoaded', function() {

  const addCardForm = document.querySelector('#add-card-form');
  if (addCardForm) {
    const stripeKey = addCardForm.dataset.stripeKey;
    const stripe    = Stripe(stripeKey);
    const elements  = stripe.elements();

    const cardErrors = document.getElementById('card-errors');

    const style = {
      base: {
        fontSize: '16px',
        color: '#32325d'
      }
    };

    const card = elements.create('card', { style, hidePostalCode: true });
    card.mount('#card-element');

    card.addEventListener('change', ({error}) => {
      if (error) {
        cardErrors.textContent = error.message;
      } else {
        cardErrors.textContent = '';
      }
    });

    addCardForm.addEventListener('submit', (event) => {
      event.preventDefault();

      stripe.createToken(card).then((result) => {
        if (result.error) {
          cardErrors.textContent = result.error.message;
        } else {
          const input = document.createElement('input');
          input.setAttribute('type', 'hidden');
          input.setAttribute('name', 'stripeToken');
          input.value = result.token.id;
          addCardForm.appendChild(input);

          addCardForm.submit();
        }
      });
    });

  }

});
