import React from 'react';

import PropTypes from 'prop-types';

class InvoiceLineForm extends React.Component {
  render() {
    return (
      <tr>
        <td>
          <form onSubmit={(e) => this.props.onSubmit(e, this._label, this._price)}>
            <input type="text" placeholder="Label" ref={(i) => this._label = i} required />
            <input type="number" placeholder="Prix" ref={(i) => this._price = i} required step="0.01" />
            <button>Add line</button>
          </form>
        </td>
      </tr>
    );
  }
}

InvoiceLineForm.propTypes = {
  onSubmit: PropTypes.func.isRequired
};

export default InvoiceLineForm;
