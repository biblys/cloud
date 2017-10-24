'use strict';

describe('Linters', function() {
  const paths = [
    'routes',
    'middlewares',
    'models',
    'tests',
    'app.js'
  ];

  // ESlint
  require('mocha-eslint')(paths);
});
