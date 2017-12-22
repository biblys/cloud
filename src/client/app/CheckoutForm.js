import React from 'react';
import { injectStripe, CardElement } from 'react-stripe-elements';
import { PropTypes } from 'prop-types';

class CheckoutForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cardError: null,
      stripeToken: null,
      loading: false
    };

  }

  async _handleSubmit(event) {
    event.preventDefault();
    const eventTarget = event.target;
    this.setState({ loading: true });

    const result = await this.props.stripe.createToken();
    if (result.error) {
      return this.setState({ loading: false, cardError: result.error.message });
    }

    this.setState({
      cardError: null,
      stripeToken: result.token.id
    });

    eventTarget.submit();
  }

  _onCardChange(event) {
    if (event.error) {
      return this.setState({ cardError: event.error.message });
    }

    this.setState({ cardError: null });
  }

  render() {

    let buttonLabel = `Payer ${this.props.amount}`;
    if (this.state.loading) {
      buttonLabel = 'Chargement...';
    }

    return (
      <form onSubmit={this._handleSubmit.bind(this)} action="/payments/create" method="POST">
        {this.state.stripeToken &&
          <input type="hidden" name="stripeToken" value={this.state.stripeToken}/>
        }
        <input type="hidden" name="invoiceId" value={this.props.invoiceId}/>
        <div className="form-row">
          <CardElement onChange={this._onCardChange.bind(this)} style={{base: {fontSize: '18px'}}} />
        </div>
        {this.state.cardError && <p className="card-errors">{this.state.cardError}</p>}
        <button disabled={this.state.loading}>
          {buttonLabel}
        </button>
      </form>
    );
  }
}

CheckoutForm.propTypes = {
  amount:    PropTypes.string.isRequired,
  invoiceId: PropTypes.string.isRequired,
  stripe:    PropTypes.object.isRequired
};

export default injectStripe(CheckoutForm);
