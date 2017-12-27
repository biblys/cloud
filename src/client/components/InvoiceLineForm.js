import React from 'react';

export default class InvoiceLifeForm extends React.Component {
  render() {
    return (
      <tr>
        <td>
          <form onSubmit={(e) => this.props.onSubmit(e, this._label)}>
            <input type="text" placeholder="Label" ref={(i) => this._label = i} />
            <button>Add line</button>
          </form>
        </td>
      </tr>
    );
  }
};
