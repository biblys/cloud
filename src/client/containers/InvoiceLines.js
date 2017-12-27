import React from 'react';

import InvoiceLine from '../components/InvoiceLine';

class InvoiceLines extends React.Component {
  state = {
    lines: [
      { _id: 1, label: 'Line 1' },
      { _id: 2, label: 'Line 2' },
      { _id: 3, label: 'Line 3' }
    ]
  };

  _getLines() {
    return this.state.lines.map((line) => (
      <InvoiceLine key={line._id} label={line.label} />
    ));
  }

  render() {
    return (
      <tbody>
        {this._getLines()}
      </tbody>
    );
  }
}

export default InvoiceLines;
