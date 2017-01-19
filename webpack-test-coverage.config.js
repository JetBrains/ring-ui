/* eslint-env node */
/* eslint-disable modules/no-cjs */

const config = require('./webpack-test.config');

config.module.loaders.push({
  test: /\.js$/,
  exclude: /\.test\.js$/,
  include: config.componentsPath,
  enforce: 'pre',
  loader: 'isparta-instrumenter'
});

module.exports = config;
