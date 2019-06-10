'use strict';

const mongoose = require('mongoose');

const mongoDebug = require('debug')('biblys-cloud:mongo');

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/biblys-cloud';
mongoose.connect(mongoUrl, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
mongoDebug(`Connected to ${mongoUrl}`);
