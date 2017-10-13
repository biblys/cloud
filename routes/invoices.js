var express = require('express');
var router = express.Router();

router.get('/:id', function(request, response, next) {
  response.render('invoice', {
    invoice: {
      id: request.params.id,
      email: 'cb@nokto.net',
      amount: '999'
    }
  });
});

module.exports = router;
