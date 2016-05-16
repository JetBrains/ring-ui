/* eslint-env node */
/* eslint-disable modules/no-cjs */

const config = require('./webpack-test.config');

config.module.preLoaders = [{
  test: /\.js$/,
  exclude: /\.test\.js$/,
  include: config.componentsPath,
  loader: 'isparta-instrumenter'
}];

module.exports = config;
