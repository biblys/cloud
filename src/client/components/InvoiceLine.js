import React from 'react';
import PropTypes from 'prop-types';

const invoiceLine = (props) => (
  <tr>
    <td>{props.label}</td>
  </tr>
);

invoiceLine.propTypes = {
  label: PropTypes.string.isRequired
};

export default invoiceLine;
