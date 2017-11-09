'use strict';

const User = require('../models/user');

// Identify user from Axys session UID
module.exports = function(req, res, next) {

  if (typeof req.cookies.userUid === 'undefined') {
    return next();
  }

  User.findOne({ axysSessionUid: req.cookies.userUid }).populate('customer').exec().then(function(user) {

    if (!user) return next();

    req.currentUser = user;
    res.locals.currentUser = user;

    return next();
  }).catch(function(error) {
    return next(error);
  });
};
