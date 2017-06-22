const path = require('path');

const webpack = require('webpack');

const config = require('./webpack.config').config;
const loaders = require('./webpack.config').loaders;

const helpersPath = path.join(__dirname, 'test-helpers');

config.resolve = {
  modules: [
    helpersPath,
    'node_modules'
  ]
};

loaders.babelLoader.include.push(helpersPath);

config.module.rules.push({
  test: /\.js$/,
  include: path.join(__dirname, 'node_modules/chai-as-promised'),
  use: {
    loader: 'babel-loader',
    options: {
      presets: ['jetbrains'],
      babelrc: false
    }
  }
});

config.output = {
  devtoolModuleFilenameTemplate: '/[absolute-resource-path]' // For some reason slash in the beginning is required
};

config.devtool = false;

config.plugins = [
  new webpack.ProvidePlugin({
    fetch: '!exports-loader?self.fetch!imports-loader' +
    '?self=>{},Promise=core-js/es6/promise!whatwg-fetch'
  }),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: '"development"'
    }
  })
];

// this addresses internal `require`s in enzyme used for environment detection
config.externals = {
  'react/addons': 'react',
  'react/lib/ExecutionEnvironment': 'react',
  'react/lib/ReactContext': 'react',
  'react-addons-test-utils': 'window'
};

module.exports = config;

