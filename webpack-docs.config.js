/* eslint-env node */
/* eslint-disable modules/no-cjs */
require('babel-polyfill');

const path = require('path');
const webpack = require('webpack');

const webpackConfigMerger = require('webpack-config-merger');
const webpackConfig = require('./webpack.config');
const AnyBarWebpackPlugin = require('anybar-webpack');

const isServer = process.argv.includes('--server');

const nodeModulesPath = path.join(__dirname, 'node_modules');
const sitePath = [
  path.join(__dirname, 'docs'),
  path.join(__dirname, 'site')
];
const publicPath = '/assets/';

const config = require('./package.json').config;

const hubOptPath = process.argv.indexOf('--hub') + 1;
const hubOpt = hubOptPath && process.argv[hubOptPath];
const hub = hubOpt || process.env.npm_package_config_hub || config.hub;
const hubUri = hub in config.hubs ? config.hubs[hub] : hub;

const productionClientId = '81a0bffb-6d0f-4a38-b93a-0a4d1e567698';
const useProductionClientId = hubUri === config.hubs.production || hubUri === config.hubs.default;

const host = process.env.npm_package_config_host || config.host;

const hubServerConfig = {
  serverUri: hubUri,
  client_id: useProductionClientId ? productionClientId : '0-0-0-0-0', // eslint-disable-line camelcase
  request_credentials: 'skip', // eslint-disable-line camelcase
  redirect_uri: `http://${host}:${config.port}/` // eslint-disable-line camelcase
};

const hubProductionConfig = {
  serverUri: config.hubs.production,
  client_id: productionClientId, // eslint-disable-line camelcase
  request_credentials: 'skip', // eslint-disable-line camelcase
  redirect_uri: 'http://ring-ui.github.io' // eslint-disable-line camelcase
};

const docsWebpackConfig = webpackConfigMerger(webpackConfig, {
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
          'postcss?pack=ring-ui',
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
    publicPath // serve HMR update json's properly
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
    new AnyBarWebpackPlugin()
  );
}

module.exports = docsWebpackConfig;
