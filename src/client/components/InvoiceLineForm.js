import React from 'react';

import PropTypes from 'prop-types';

class InvoiceLineForm extends React.Component {
  render() {
    const style = { display: 'flex' };
    return (
      <tr>
        <td colSpan="3">
          <form style={style} onSubmit={(e) => this.props.onSubmit(e, this._label, this._price)}>
            <input type="text" placeholder="Prestation" ref={(i) => this._label = i} required />
            <input type="number" placeholder="Montant" ref={(i) => this._price = i} required step="0.01" />
            <button>+</button>
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
