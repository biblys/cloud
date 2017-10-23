const express = require('express');
const router = express.Router();

const auth      = require('../middlewares/auth');
const authAdmin = require('../middlewares/authAdmin');

// Home page
router.get('/', function(request, response) {
  response.render('index');
});

// Admin dashboard
router.get('/admin/', auth, authAdmin, function(request, response) {
  response.render('admin');
});

module.exports = router;
