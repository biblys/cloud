import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Price from '../components/Price';

export default class PaymentList extends React.Component {
  state = { payments: [] };

  componentDidMount() {
    this._fetchLines();
  }

  _fetchLines = async () => {
    const response = await fetch('/payments/', {
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const payments = await response.json();
    this.setState({ payments });
  };

  _renderLines(payments) {
    return payments.map(payment => (
      <tr key={payment._id}>
        <td>
          {payment.customer.name}
          <br />
          {payment.user && <small>{payment.user.name}</small>}
        </td>
        <td>
          <a href={`/invoices/${payment.invoice._id}`}>
            {payment.invoice.number}
          </a>
        </td>
        <td>{payment.method}</td>
        <td>{payment.date && moment(payment.date).format('DD/MM/YYYY')}</td>
        <td className="right">
          <Price amount={+payment.amount} />
        </td>
      </tr>
    ));
  }

  render() {
    let { payments } = this.state;

    // Filter by year
    if (this.props.year && this.props.year.length === 4) {
      payments = payments.filter(payment => {
        const year = payment.date && moment(payment.date).format('YYYY');
        return year === this.props.year;
      });
    }

    // Filter by month
    if (this.props.month) {
      payments = payments.filter(payment => {
        const month = payment.date && moment(payment.date).format('M');
        return month === this.props.month;
      });
    }

    const total = payments.reduce(
      (total, payment) => total + parseInt(payment.amount),
      0,
    );

    return (
      <table>
        <thead>
          <tr>
            <th>Client</th>
            <th>Facture</th>
            <th>Mode</th>
            <th>Date</th>
            <th>Montant</th>
          </tr>
        </thead>
        <tbody>{this._renderLines(payments)}</tbody>
        <tfoot>
          <tr>
            <th className="total">Total :</th>
            <th className="price right" colSpan={4}>
              <Price amount={total} />
            </th>
          </tr>
        </tfoot>
      </table>
    );
  }
}

PaymentList.propTypes = {
  month: PropTypes.string,
  year: PropTypes.string,
};
