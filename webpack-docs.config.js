require('babel-polyfill');

const path = require('path');

const webpack = require('webpack');
const {DllBundlesPlugin} = require('webpack-dll-bundles-plugin');

const webpackConfig = require('./webpack.config');
const docpackSetup = require('./webpack-docs-plugin.setup');
const createEntriesList = require('./site/create-entries-list');
const pkgConfig = require('./package.json').config;

// Borrowed from webpack-dev-server
const colorInfo = msg => `\u001b[1m\u001b[34m${msg}\u001b[39m\u001b[22m`;

const publicPath = '/';
const distDir = 'dist';
const contentBase = path.resolve(__dirname, distDir);

// For docs-app entry point
webpackConfig.componentsPath.push(path.resolve(__dirname, 'site'));

module.exports = (env = {}) => {
  const {server, production} = env;
  const envString = production ? 'production' : 'development';
  const devtool = production ? 'source-map' : 'eval';

  const getParam = name => (
    env[name] ||
    process.env[`npm_package_config_${name}`] ||
    process.env[`npm_package_config_${envString}_${name}`] ||
    pkgConfig[name] ||
    pkgConfig[envString][name]
  );

  const port = Number(getParam('port'));
  const host = getParam('host');
  const serverUri = getParam('hub');
  const clientId = getParam('clientId');

  console.log(`Hub server used is ${colorInfo(serverUri)}`);
  const hubConfig = JSON.stringify({serverUri, clientId});

  const docsWebpackConfig = {
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
    context: __dirname,
    module: {
      rules: [
        ...webpackConfig.config.module.rules,
        // HTML examples
        {
          test: /example\.html$/,
          loaders: [
            `${require.resolve('file-loader')}?name=examples/[name]/[hash].html`,
            require.resolve('extract-loader'),
            webpackConfig.loaders.htmlLoader.loader
          ]
        }
      ]
    },
    devtool,
    devServer: {
      host,
      port,
      contentBase,
      stats: {
        assets: false,
        chunks: false,
        hash: false,
        children: 'error',
        version: false
      }
    },
    output: {
      path: contentBase,
      pathinfo: server,
      filename: '[name].js',
      publicPath // serve HMR update jsons properly
    },
    plugins: [
      new webpack.DefinePlugin({hubConfig}),
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
        dllDir: distDir,
        webpackConfig: {
          devtool,
          module: {
            rules: [
              webpackConfig.loaders.whatwgLoader
            ]
          },
          plugins: [] // DllBundlesPlugin will set the DllPlugin here
        }
      })
    ]
  };

  // if (server) {
  //   docsWebpackConfig.plugins.push(
  //     new webpack.HotModuleReplacementPlugin(),
  //   );
  // }

  return docsWebpackConfig;
};
