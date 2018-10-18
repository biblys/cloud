import React from 'react';

import PaymentList from './PaymentList';

export default class Payments extends React.Component {
  state = {
    year: null
  };

  _onYearChange(year) {
    this.setState({ year });
  }

  render() {
    return (
      <React.Fragment>
        <form>
          <input
            onChange={event => this._onYearChange(event.target.value)}
            type="number"
            min="2010"
            max="2030"
          />
        </form>
        <PaymentList year={this.state.year} />
      </React.Fragment>
    );
  }
}
