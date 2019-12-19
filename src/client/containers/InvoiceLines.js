import React from 'react';
import PropTypes from 'prop-types';

import InvoiceLine from '../components/InvoiceLine';
import InvoiceLineForm from '../components/InvoiceLineForm';
import Price from '../components/Price';

class InvoiceLines extends React.Component {
  state = { lines: [] };

  componentDidMount() {
    this._fetchLines();
  }

  _fetchLines = async () => {
    const response = await fetch(`/invoices/${this.props.invoiceId}/lines`, {
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const lines = await response.json();
    this.setState({ lines });
  };

  _addLine = async (event, label, price) => {
    event.preventDefault();

    // POST new line
    await fetch(`/invoices/${this.props.invoiceId}/lines`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ label: label.value, price: price.value }),
    });

    // eslint-disable-next-line require-atomic-updates
    label.value = '';
    // eslint-disable-next-line require-atomic-updates
    price.value = '';
    label.focus();
    this._fetchLines();
  };

  _deleteLine = async id => {
    // DELETE line on server
    await fetch(`/invoices/${this.props.invoiceId}/lines/${id}`, {
      method: 'DELETE',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    // Update state from server
    this._fetchLines();
  };

  _renderLines() {
    return this.state.lines.map(line => (
      <InvoiceLine
        key={line._id}
        label={line.label}
        price={line.price}
        deleteLine={() => this._deleteLine(line._id)}
        isAdmin={this.props.isAdmin}
      />
    ));
  }

  render() {
    const total = this.state.lines.reduce(
      (total, line) => total + line.price,
      0,
    );
    return (
      <React.Fragment>
        <thead>
          <tr>
            <th className="label">Prestation</th>
            <th>Montant</th>
          </tr>
        </thead>
        <tbody>
          {this._renderLines()}
          {this.props.isAdmin && <InvoiceLineForm onSubmit={this._addLine} />}
        </tbody>
        <tfoot>
          <tr>
            <th className="total">Total :</th>
            <th className="price">
              <Price amount={total} />
            </th>
          </tr>
        </tfoot>
      </React.Fragment>
    );
  }
}

InvoiceLines.propTypes = {
  invoiceId: PropTypes.string.isRequired,
  isAdmin: PropTypes.bool.isRequired,
};

export default InvoiceLines;
