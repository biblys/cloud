'use strict';

describe('Linters', function() {
  const paths = [
    'controllers',
    'lib',
    'middlewares',
    'migrations',
    'models',
    'tests',
    'app.js',
    'src/client'
  ];

  // JSCS
  require('mocha-jscs')(paths);

  // ESlint
  require('mocha-eslint')(paths);
});
