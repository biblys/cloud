import React from 'react';

class InvoiceLines extends React.Component {
  state = {
    lines: [
      { label: 'Line 1' },
      { label: 'Line 2' },
      { label: 'Line 3' }
    ]
  };

  render() {
    return (
      <tbody>
      </tbody>
    );
  }
}

export default InvoiceLines;
