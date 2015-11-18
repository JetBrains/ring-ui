/* eslint-env node */
/* eslint-disable no-var */
/* eslint-disable modules/no-cjs */
/* eslint-disable camelcase */

var path = require('path');
var webpack = require('webpack');

var webpackConfigMerger = require('webpack-config-merger');
var webpackConfig = require('./webpack.config');
var AnyBarWebpackPlugin = require('anybar-webpack');
var progressPlugin = require('./tools/progress-webpack-plugin');

var isServer = process.argv.indexOf('--server') !== -1;

var nodeModulesPath = path.join(__dirname, 'node_modules');
var sitePath = [
  path.join(__dirname, 'docs'),
  path.join(__dirname, 'site')
];
var publicPath = '/assets/';

var config = require('./package.json').config;

var hubOptPath = process.argv.indexOf('--hub') + 1;
var hubOpt = hubOptPath && process.argv[hubOptPath];
var hub = hubOpt || process.env.npm_package_config_hub || config.hub;
var hubUri = hub in config.hubs ? config.hubs[hub] : hub;

var productionClientId = '81a0bffb-6d0f-4a38-b93a-0a4d1e567698';
var useProductionClientId = hubUri === config.hubs.production || hubUri === config.hubs.default;

var hubServerConfig = {
  serverUri: hubUri,
  client_id: useProductionClientId ? productionClientId : '0-0-0-0-0',
  request_credentials: 'skip',
  redirect_uri: 'http://localhost:' + config.port + '/'
};

var hubProductionConfig = {
  serverUri: config.hubs.production,
  client_id: productionClientId,
  request_credentials: 'skip',
  redirect_uri: 'http://ring-ui.github.io'
};

var docsWebpackConfig = webpackConfigMerger(webpackConfig, {
  entry: {
    index: './site/'
  },
  resolve: {
    alias: {
      'ring-ui': __dirname
    }
  },
  module: {
    loaders: [
      {
        test: /\.scss$/,
        include: sitePath,
        loaders: [
          'style',
          'css',
          // TODO Update autoprefixer config and move to postcss-loader
          'autoprefixer?browsers=last 2 versions, safari 5, ie 8, ie 9, opera 12.1, ios 6, android 4',
          'sass?outputStyle=expanded'
        ]
      },
      {
        test: /\.css$/,
        include: nodeModulesPath,
        loaders: [
          'style',
          'css'
        ]
      },
      {
        test: /\.js$/,
        include: sitePath,
        loader: 'babel'
      }
    ]
  },
  devtool: isServer ? 'eval' : '#source-map',
  debug: isServer,
  output: {
    path: path.resolve(__dirname, 'docs', 'assets'),
    pathinfo: isServer,
    filename: '[name].js',
    publicPath: publicPath // serve HMR update json's properly
  },
  plugins: [
    new webpack.DefinePlugin({
      hubConfig: JSON.stringify(isServer ? hubServerConfig : hubProductionConfig)
    })
  ]
});

if (isServer) {
  docsWebpackConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new AnyBarWebpackPlugin(),
    progressPlugin
  );
}

module.exports = docsWebpackConfig;
