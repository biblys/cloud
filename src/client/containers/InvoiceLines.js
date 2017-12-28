import React from 'react';
import PropTypes from 'prop-types';

import InvoiceLine from '../components/InvoiceLine';
import InvoiceLineForm from '../components/InvoiceLineForm';

class InvoiceLines extends React.Component {
  state = { lines: [] };

  componentWillMount() {
    this._fetchLines();
  }

  _fetchLines = async () => {
    const response = await fetch(`/invoices/${this.props.invoiceId}/lines`, {
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });
    const lines = await response.json();
    this.setState({ lines });
  }

  _addLine = async (event, label, price) => {
    event.preventDefault();

    // POST new line
    await fetch(`/invoices/${this.props.invoiceId}/lines`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ label: label.value, price: price.value })
    });

    label.value = '';
    price.value = '';
    label.focus();
    this._fetchLines();
  }

  _deleteLine = async (id) => {
    // DELETE line on server
    await fetch(`/invoices/${this.props.invoiceId}/lines/${id}`, {
      method: 'DELETE',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });

    // Update state from server
    this._fetchLines();
  }

  _renderLines() {
    return this.state.lines.map((line) => (
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
    return (
      <tbody>
        {this._renderLines()}
        {this.props.isAdmin && <InvoiceLineForm onSubmit={this._addLine} />}
      </tbody>
    );
  }
}

InvoiceLines.propTypes = {
  invoiceId: PropTypes.string.isRequired,
  isAdmin: PropTypes.bool.isRequired
};

export default InvoiceLines;
