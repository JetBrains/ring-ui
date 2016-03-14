/* eslint-env node */
/* eslint-disable no-var */
/* eslint-disable modules/no-cjs */

var config = require('./webpack-test.config');

config.module.preLoaders = [{
  test: /\.js$/,
  exclude: /\.test\.js$/,
  include: config.componentsPath,
  loader: 'isparta-instrumenter'
}];

module.exports = config;
