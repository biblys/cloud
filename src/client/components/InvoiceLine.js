import React from 'react';
import PropTypes from 'prop-types';

const invoiceLine = (props) => (
  <tr>
    <td>{props.label}</td>
    {props.isAdmin &&
      <td>
        <button onClick={props.deleteLine}>x</button>
      </td>
    }
  </tr>
);

invoiceLine.propTypes = {
  deleteLine: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired
};

export default invoiceLine;
