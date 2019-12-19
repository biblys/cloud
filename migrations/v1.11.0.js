'use strict';

const debug = require('debug')('migrations');
require('../database');

const Payment = require('../models/payment');
const User = require('../models/user');
require('../models/customer');

const migrate = async () => {
  const payments = await Payment.find({ date: undefined })
    .populate('customer')
    .exec();
  await Promise.all(
    payments.map(async payment => {
      payment.date = payment.createdAt;

      if (typeof payment.user === 'undefined') {
        const user = await User.findOne({ customer: payment.customer.id });
        // eslint-disable-next-line require-atomic-updates
        payment.user = user._id;
      }

      debug(`Migrating payment ${payment._id}`);
      return payment.save();
    }),
  );
};

module.exports = migrate;

migrate()
  .then(() => {
    debug('Migration successful \n');
    process.exit(0);
  })
  .catch(error => {
    debug(`${error.message} \n`);
    process.exit(1);
  });
