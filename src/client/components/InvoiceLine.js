import React from 'react';
import PropTypes from 'prop-types';

import Price from './Price.js';

const invoiceLine = (props) => (
  <tr>
    <td>{props.label}</td>
    <td className="price">
      <Price amount={props.price} />
    </td>
    {props.isAdmin &&
      <td className="invoice-delete">
        <button onClick={props.deleteLine}>x</button>
      </td>
    }
  </tr>
);

invoiceLine.propTypes = {
  deleteLine: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired
};

export default invoiceLine;
