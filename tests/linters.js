'use strict';

describe('Linters', function() {
  const paths = [
    'routes',
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
