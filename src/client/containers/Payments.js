import React from 'react';

import PaymentList from './PaymentList';

export default class Payments extends React.Component {
  state = {
    month: null,
    year: null,
  };

  _onYearChange(year) {
    this.setState({ year });
  }

  _onMonthChange(month) {
    this.setState({ month });
  }

  render() {
    return (
      <React.Fragment>
        <form>
          <select onChange={event => this._onMonthChange(event.target.value)}>
            <option />
            <option value="1">janvier</option>
            <option value="2">février</option>
            <option value="3">mars</option>
            <option value="4">avril</option>
            <option value="5">mai</option>
            <option value="6">juin</option>
            <option value="7">juillet</option>
            <option value="8">août</option>
            <option value="9">septembre</option>
            <option value="10">octobre</option>
            <option value="11">novembre</option>
            <option value="12">décembre</option>
          </select>
          <input
            onChange={event => this._onYearChange(event.target.value)}
            type="number"
            min="2010"
            max="2030"
            placeholder="Année"
          />
        </form>
        <PaymentList month={this.state.month} year={this.state.year} />
      </React.Fragment>
    );
  }
}
