const express = require('express');
const router = express.Router();

const auth      = require('../middlewares/auth');
const authAdmin = require('../middlewares/authAdmin');

// Home page
router.get('/', function(request, response) {
  response.render('index');
});

router.get('/login', auth, function(request, response) {
  response.redirect('/');
});

router.get('/logout', function(request, response) {
  response.cookie('userUid', '', { expires: new Date(0) });
  response.redirect('/');
});

// Admin dashboard
router.get('/admin/', auth, authAdmin, function(request, response) {
  response.render('admin');
});

module.exports = router;
