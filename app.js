require('dotenv').config();
const express      = require('express');
const path         = require('path');
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const mongoose     = require('mongoose');
const http         = require('http');
const twig         = require('twig');

// Create Express app
const app = express();

// Controllers
const customers     = require('./controllers/customers');
const index         = require('./controllers/index');
const invoices      = require('./controllers/invoices');
const payments      = require('./controllers/payments');
const users         = require('./controllers/users');

// Debug logs
const mongoDebug = require('debug')('biblys-cloud:mongo');

// Middlewares
const axysReturn   = require('./middlewares/axysReturn');
const identifyUser = require('./middlewares/identifyUser');

// MongoDB
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/biblys-cloud';
mongoose.connect(mongoUrl, { useMongoClient: true });
mongoose.Promise = global.Promise;
mongoDebug(`Connected to ${mongoUrl}`);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

twig.extendFilter('currency', function(value) {
  value /= 100;
  value = value.toFixed(2).toString().replace('.', ',');
  return `${value} €`;
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Get version from package.json and inject in locals
const version = require('./package.json').version;
app.locals.version = version;

// Security headers
app.use(function(request, response, next) {
  if (app.get('env') == 'production') {
    response.setHeader('Content-Security-Policy', "default-src 'none'; connect-src https://js.stripe.com; script-src 'self' https://js.stripe.com; style-src 'self' https://js.stripe.com https://cdnjs.cloudflare.com; img-src 'self' https://q.stripe.com data:; frame-src https://js.stripe.com; frame-ancestors 'none'; base-uri 'none'; object-src 'none'");
  }

  response.setHeader('X-Frame-Options', 'DENY');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('X-XSS-Protection', '1; mode=block');
  response.setHeader('Referrer-Policy', 'no-referrer');
  response.removeHeader('X-Powered-By');

  return next();
});

// Detect return from Axys
app.use(axysReturn);

// Identify user from Axys UID
app.use(identifyUser);

app.use('/', index);
app.use('/customers', customers);
app.use('/invoices', invoices);
app.use('/payments', payments);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404);
  next('Not Found');
});

// error handler
app.use(function(err, req, res, next) {

  if (res.headersSent) {
    return next(err);
  }

  const error = new Error(err);
  if (typeof err.stack !== 'undefined') {
    error.stack = err.stack;
  }

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  // set locals, only providing error in development
  res.locals.message = error.message;
  res.locals.errorCode = statusCode;
  res.locals.error = req.app.get('env') === 'development' ? error : {};

  res.status(statusCode);

  if (req.accepts('json') && !req.accepts('html')) {
    return res.send({ error: error.message });
  }

  // render the error page
  res.render('error');
});

// Create HTTP server
const server = http.createServer(app);

server.on('close', function() {
  mongoose.connection.close();
  mongoDebug(`Closing connection to ${mongoUrl}`);
});

module.exports = server;
