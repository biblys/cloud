const express      = require('express');
const path         = require('path');
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const mongoose     = require('mongoose');
const http         = require('http');

// Load config file
const config = require('./config.js');

// Create Express app
const app = express();

// Controllers
const index    = require('./controllers/index');
const invoices = require('./controllers/invoices');
const payments = require('./controllers/payments');

// Debug logs
const mongoDebug = require('debug')('biblys-cloud:mongo');

// Middlewares
const axysReturn   = require('./middlewares/axysReturn');
const identifyUser = require('./middlewares/identifyUser');

// MongoDB
const mongoUrl = config.MONGO_URL || process.env.MONGO_URL || 'mongodb://localhost/biblys-cloud';
mongoose.connect(mongoUrl, { useMongoClient: true });
mongoDebug(`Connected to ${mongoUrl}`);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(config.COOKIE_PARSER_SECRET));
app.use(express.static(path.join(__dirname, 'public')));

// Security headers
app.use(function(request, response, next) {
  response.setHeader('Content-Security-Policy', "default-src 'none'; connect-src https://checkout.stripe.com; script-src https://checkout.stripe.com https://axys.me; style-src 'self' https://checkout.stripe.com https://axys.me; img-src 'self' https://q.stripe.com https://axys.me; frame-src https://checkout.stripe.com; frame-ancestors 'none'; base-uri 'none'; object-src 'none'");
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
app.use('/invoices', invoices);
app.use('/payments', payments);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Create HTTP server
const server = http.createServer(app);

server.on('close', function() {
  mongoose.connection.close();
  mongoDebug(`Closing connection to ${mongoUrl}`);
});

module.exports = server;
