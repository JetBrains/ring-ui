/* eslint-env node */
/* eslint-disable no-var */
/* eslint-disable modules/no-cjs */

var path = require('path');
var config = require('./webpack.config');
var webpack = require('webpack');

config.resolve = {
  root: path.join(__dirname, 'test-helpers')
};

config.plugins = [
  new webpack.ProvidePlugin({
    fetch: '!exports?self.fetch!imports?self=>{},Promise=core-js/es6/promise!whatwg-fetch'
  })
];

module.exports = config;

