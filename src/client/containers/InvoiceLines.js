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

  _addLine = async (event, label) => {
    event.preventDefault();

    // Update state
    const line = { _id: Math.random(), label: label.value };
    const lines = [...this.state.lines, line];
    this.setState({ lines });

    // POST new line
    await fetch(`/invoices/${this.props.invoiceId}/lines`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ label: label.value })
    });

    label.value = '';
    this._fetchLines();
  }

  _getLines() {
    return this.state.lines.map((line) => (
      <InvoiceLine key={line._id} label={line.label} />
    ));
  }

  render() {
    return (
      <tbody>
        {this._getLines()}
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
