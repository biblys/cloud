'use strict';

const debug = require('debug')('migrations');
require('../database');

const Payment = require('../models/Payment');
const User = require('../models/User');
require('../models/Customer');

const migrate = async () => {
  try {
    const payments = await Payment.find({ date: undefined }).populate('customer').exec();
    await Promise.all(payments.map(async (payment) => {
      payment.date = payment.createdAt;

      if (typeof payment.user === 'undefined') {
        const user = await User.findOne({ customer: payment.customer.id });
        payment.user = user._id;
      }

      debug(`Migrating payment ${payment._id}`);
      return payment.save();
    }));
  } catch (error) {
    throw error;
  }
};

module.exports = migrate;

migrate().then(() => {
  debug('Migration successful \n');
  process.exit(0);
}).catch(error => {
  debug(`${error.message} \n`);
  process.exit(1);
});

