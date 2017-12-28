import React from 'react';
import PropTypes from 'prop-types';

const price = (props) => {
  const amount = (props.amount / 100).toFixed(2).toString().replace('.', ',');
  return (
    <React.Fragment>
      {amount}&nbsp;€
    </React.Fragment>
  );
};

price.propTypes = {
  amount: PropTypes.number.isRequired
};

export default price;
