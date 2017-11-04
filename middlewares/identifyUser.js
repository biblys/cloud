'use strict';

const Customer = require('../models/customer');

// Identify user from Axys session UID
module.exports = function(req, res, next) {

  if (typeof req.cookies.userUid === 'undefined') {
    return next();
  }

  Customer.findOne({ axysSessionUid: req.cookies.userUid }, function(err, customer) {

    if (err) return next(err);

    if (!customer) return next();

    req.currentCustomer = customer;
    res.locals.currentCustomer = customer;

    return next();
  });
};
