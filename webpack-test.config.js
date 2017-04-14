/* eslint-env node */

const path = require('path');
const config = require('./webpack.config').config;
const loaders = require('./webpack.config').loaders;
const webpack = require('webpack');

const helpersPath = path.join(__dirname, 'test-helpers');

config.resolve = {
  modules: [
    helpersPath,
    'node_modules'
  ]
};

loaders.babelLoader.include.push(helpersPath);

config.output = {
  devtoolModuleFilenameTemplate: '/[absolute-resource-path]' // For some reason slash in the beginning is required
};

config.devtool = false;

config.plugins = [
  new webpack.ProvidePlugin({
    fetch: '!exports-loader?self.fetch!imports-loader?self=>{},Promise=core-js/es6/promise!whatwg-fetch'
  }),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: '"development"'
    }
  })
];

module.exports = config;

