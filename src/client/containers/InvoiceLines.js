import React from 'react';

import InvoiceLine from '../components/InvoiceLine';
import InvoiceLineForm from '../components/InvoiceLineForm';

class InvoiceLines extends React.Component {
  state = {
    lines: [
      { _id: 1, label: 'Line 1' },
      { _id: 2, label: 'Line 2' },
      { _id: 3, label: 'Line 3' }
    ]
  };

  _addLine = (event, label) => {
    event.preventDefault();
    const line = { _id: Math.random(), label: label.value };
    const lines = [...this.state.lines, line];
    this.setState({ lines });
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
        <InvoiceLineForm onSubmit={this._addLine} />
      </tbody>
    );
  }
}

export default InvoiceLines;
