import React from 'react';
import moment from 'moment';

import Price from '../components/Price';

class PaymentList extends React.Component {
  state = { payments: [] };

  componentDidMount() {
    this._fetchLines();
  }

  _fetchLines = async () => {
    const response = await fetch('/payments/', {
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
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
          <a href={`/invoice/${payment.invoice._id}`}>
            {payment.invoice.number}
          </a>
        </td>
        <td>{payment.method}</td>
        <td>{moment(payment.createdAt).format('DD/MM/YYYY')}</td>
        <td className="right">
          <Price amount={+payment.amount} />
        </td>
      </tr>
    ));
  }

  render() {
    let payments = this.state.payments;

    // Filter by year
    if (this.props.year && this.props.year.length === 4) {
      payments = this.state.payments.filter(payment => {
        const year = moment(payment.createdAt).format('YYYY');
        return year === this.props.year;
      });
    }

    const total = payments.reduce(
      (total, payment) => total + +payment.amount,
      0
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

export default PaymentList;
