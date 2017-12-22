'use strict';

require('webpack');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, 'public/javascripts');
const APP_DIR = path.resolve(__dirname, 'src/client/app');

const config = {
  entry: `${APP_DIR}/index.js`,
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  }
};

module.exports = config;
