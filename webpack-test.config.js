/* eslint-env node */
/* eslint-disable modules/no-cjs */

const path = require('path');
const config = require('./webpack.config');
const webpack = require('webpack');

config.resolve = {
  root: path.join(__dirname, 'test-helpers')
};

config.output = {
  devtoolModuleFilenameTemplate: '/[absolute-resource-path]' // For some reason slash in the beginning is required
};

config.devtool = 'eval';

config.plugins = [
  new webpack.ProvidePlugin({
    fetch: '!exports?self.fetch!imports?self=>{},Promise=core-js/es6/promise!whatwg-fetch'
  })
];

module.exports = config;

