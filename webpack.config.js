'use strict';

require('webpack');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, 'public/javascripts');
const APP_DIR = path.resolve(__dirname, 'src/client');

const config = {
  entry: [
    'babel-polyfill',
    `${APP_DIR}/index.js`
  ],
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js/,
        include: APP_DIR,
        loader: 'babel-loader'
      }
    ]
  }
};

module.exports = config;
