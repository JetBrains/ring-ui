/* eslint-env node */
/* eslint-disable modules/no-cjs */
require('babel-polyfill');

const path = require('path');
const webpack = require('webpack');

const webpackConfigMerger = require('webpack-config-merger');
const webpackConfig = require('./webpack.config');
const AnyBarWebpackPlugin = require('anybar-webpack');
const DllBundlesPlugin = require('webpack-dll-bundles-plugin').DllBundlesPlugin;

const docpackSetup = require('./webpack-docs-plugin.setup');
const createEntriesList = require('./site/create-entries-list');

const isServer = process.argv.includes('--server');

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

// For docs-app entry point
webpackConfig.loaders.babelLoader.include.push(path.resolve(__dirname, 'site'));

const contentBase = path.resolve(__dirname, 'dist');

const docsWebpackConfig = webpackConfigMerger(webpackConfig.config, {
  entry: {
    components: createEntriesList('./components/*'),
    'docs-app': './site/index.js',
    'example-common': './site/example-common.js'
  },
  resolve: {
    alias: {
      'ring-ui': __dirname
    }
  },
  context: '.',
  module: {
    loaders: [
      // HTML examples
      {
        test: /example\.html$/,
        loaders: [
          `${require.resolve('file-loader')}?name=examples/[name]/[hash].html`,
          require.resolve('extract-loader'),
          webpackConfig.loaders.htmlLoader.loader
        ]
      },
      // For github-markdown-css
      {
        test: /\.css$/,
        include: [
          path.resolve('./node_modules/github-markdown-css'),
          path.resolve('./node_modules/highlight.js')
        ],
        loaders: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.twig$/,
        loaders: [
          'twig-loader'
        ]
      }
    ]
  },
  devtool: isServer ? 'eval' : false,
  devServer: {
    contentBase,
    inline: true,
    stats: {
      assets: true,
      chunks: false,
      hash: false,
      children: false,
      version: false
    }
  },
  output: {
    path: contentBase,
    pathinfo: isServer,
    filename: '[name].js',
    publicPath // serve HMR update json's properly
  },
  plugins: [
    new webpack.DefinePlugin({
      hubConfig: JSON.stringify(isServer ? hubServerConfig : hubProductionConfig)
    }),
    docpackSetup(),
    new DllBundlesPlugin({
      bundles: {
        vendor: [
          'babel-polyfill',
          'core-js',
          'dom4',
          'whatwg-fetch',
          'react',
          'react-dom',
          '@hypnosphi/react-portal',
          'react-waypoint',
          'angular',
          'classnames',
          'combokeys',
          'moment',
          'simply-uuid'
        ]
      },
      dllDir: './dist',
      webpackConfig: {
        devtool: 'cheap-module-source-map',
        plugins: [] // DllBundlesPlugin will set the DllPlugin here
      }
    })
  ]
});

if (isServer) {
  docsWebpackConfig.plugins.push(
    //new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new AnyBarWebpackPlugin()
  );
}

module.exports = docsWebpackConfig;
