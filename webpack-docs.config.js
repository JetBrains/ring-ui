/* eslint-env node */
/* eslint-disable modules/no-cjs */
require('babel-polyfill');

const path = require('path');
const webpack = require('webpack');

const webpackConfigMerger = require('webpack-config-merger');
const webpackConfig = require('./webpack.config');
const AnyBarWebpackPlugin = require('anybar-webpack');
const progressPlugin = require('./tools/progress-webpack-plugin');

const DocsPlugin = require('webpack-docs-plugin');
const docsPluginSetup = require('./webpack-docs-plugin.setup');
const assign = require('deep-assign');

const isServer = process.argv.includes('--server');

const nodeModulesPath = path.join(__dirname, 'node_modules');
const sitePath = [
  path.join(__dirname, 'docs'),
  path.join(__dirname, 'site')
];
const publicPath = '/';

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

const exampleHtmlLoaderConfig = assign(webpackConfig.htmlLoader);
exampleHtmlLoaderConfig.test = /\.html$/;
exampleHtmlLoaderConfig.loaders = [
  `${require.resolve('file-loader')}?name=docs/[path][name].[ext]/examples/[hash].html`,
  require.resolve('extract-loader'),
  webpackConfig.htmlLoader.loader
];
delete exampleHtmlLoaderConfig.loader;

// For docs-app entry point
webpackConfig.babelLoader.include.push(path.resolve(__dirname, 'site'));

const docsWebpackConfig = webpackConfigMerger(webpackConfig, {
  entry: {
    components: './components/button/index.js',
    'docs-app': './site/index.js',
    'docs-markdown': [
      'index.md',
      'breaking-changes.md',
      'migration-to-2.3.0.md'
    ].map(filename => path.join(__dirname, `components/${filename}`))
  },
  resolve: {
    alias: {
      'ring-ui': __dirname
    }
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'components'),
        loader: DocsPlugin.extract({extractor: 'jsdoc'})
      },
      {
        test: /\.md$/,
        loader: DocsPlugin.extract({extractor: 'markdown'})
      },
      // For github-markdown-css
      {
        test: /\.css$/,
        include: nodeModulesPath,
        loaders: [
          'style',
          'css'
        ]
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
  .concat(docsPluginSetup({
    publicPath: publicPath
  }))
});

if (isServer) {
  docsWebpackConfig.plugins.push(
    //new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new AnyBarWebpackPlugin(),
    progressPlugin
  );
}

module.exports = docsWebpackConfig;
