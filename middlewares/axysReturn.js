'use strict';

const url          = require('url');
const request      = require('request');

const config = require('../config.js');

const Customer = require('../models/customer');

const debug      = require('debug')('biblys-cloud:app');

// Handle axys return
module.exports = function(req, res, next) {

  if (typeof req.query.UID === 'undefined') {
    return next();
  }

  request(`https://axys.me/call.php?key=${config.AXYS_SECRET_KEY}&uid=${req.query.UID}&format=json`, function(error, response, body) {

    if (error) return next(error);

    // If UID is unkown by Axys, delete cookie
    if (response.statusCode == 404) {
      res.cookie('userUid', '', { expires: new Date(0) });
      return next();
    }

    // If another error occurs
    if (response.statusCode != 200) {
      const json = JSON.parse(body);
      return next(`Axys error ${response.statusCode}: ${json.error}`);
    }

    // Else is response has status 200
    const json = JSON.parse(body);

    // Find customer for this axys id
    Customer.findOne({ axysId: json.user_id }, function(err, customer) {
      if (err) throw err;

      // If no customer found, throw error
      if (!customer) {
        return next(`User ${json.user_email} is unknown.`);
      }

      // Associate Axys session UID with customer
      customer.axysSessionUid = req.query.UID;
      customer.save(function(err) {
        if (err) return next(err);

        // Set cookie
        res.cookie('userUid', req.query.UID, {
          httpOnly: true,
          secure: request.secure
        });

        debug(`User logged from Axys with UID ${req.query.UID} `);

        // Remove UID from URL
        const destination = url.parse(req.url).pathname;
        res.redirect(destination);
        return;
      });
    });

  });
};
