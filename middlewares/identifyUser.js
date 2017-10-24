'use strict';

const Customer = require('../models/customer');

// Identify user from Axys session UID
module.exports = function(req, res, next) {

  if (typeof req.signedCookies.userUid === 'undefined') {
    return next();
  }

  Customer.findOne({ axysSessionUid: req.signedCookies.userUid }, function(err, customer) {

    if (err) return next(err);

    if (!customer) return next();

    req.customer = customer;
    res.locals.customer = customer;

    return next();
  });
};
