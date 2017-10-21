const express      = require('express');
const path         = require('path');
const favicon      = require('serve-favicon');
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const mongoose     = require('mongoose');
const url          = require('url');
const request      = require('request');

const index = require('./routes/index');
const invoices = require('./routes/invoices');

const app = express();

// Config
const config = require('./config.js');

// MongoDB
const mongoUrl = config.MONGO_URL || process.env.MONGO_URL || 'mongodb://localhost/biblys-cloud';
mongoose.connect(mongoUrl, { useMongoClient: true });
process.stdout.write(`Mongoose connected to ${mongoUrl}\n`);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(config.COOKIE_PARSER_SECRET));
app.use(express.static(path.join(__dirname, 'public')));

// Security headers
app.use(function(request, response, next) {
  response.setHeader('Content-Security-Policy', "default-src 'none'; connect-src https://checkout.stripe.com; script-src https://checkout.stripe.com https://axys.me; style-src 'self' https://checkout.stripe.com https://axys.me; img-src https://q.stripe.com https://axys.me; frame-src https://checkout.stripe.com; frame-ancestors 'none'; base-uri 'none'; object-src 'none'");
  response.setHeader('X-Frame-Options', 'DENY');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('X-XSS-Protection', '1; mode=block');
  response.setHeader('Referrer-Policy', 'no-referrer');
  response.removeHeader('X-Powered-By');

  return next();
});

// Detect return from Axys
app.use(function(request, response, next) {

  if (typeof request.query.UID !== 'undefined') {

    // Set cookie
    response.cookie('userUid', request.query.UID, {
      httpOnly: true,
      secure: request.secure,
      signed: true
    });

    // Remove UID from URL
    const destination = url.parse(request.url).pathname;
    response.redirect(destination);
    return;
  }

  next();
});

// Check userUid
app.use(function(req, res, next) {
  if (req.signedCookies.userUid !== 'undefined') {
    request(`https://axys.me/call.php?key=${config.AXYS_SECRET_KEY}&uid=${req.signedCookies.userUid}&format=json`, function (error, response, body) {

      if (error) {
        throw error;
      }

      if (response.statusCode == 200) {
        const json = JSON.parse(body);
        console.log(json);
      }
    });
  }

  next();
});

app.use('/', index);
app.use('/invoices', invoices);

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

module.exports = app;
