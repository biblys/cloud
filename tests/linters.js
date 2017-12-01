'use strict';

describe('Linters', function() {
  const paths = [
    'controllers',
    'lib',
    'middlewares',
    'models',
    'tests',
    'app.js'
  ];

  // JSCS
  require('mocha-jscs')(paths);

  // ESlint
  require('mocha-eslint')(paths);
});
