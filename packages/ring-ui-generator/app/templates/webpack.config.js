/* eslint-env node */
/* eslint-disable modules/no-cjs */

const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackConfigMerger = require('webpack-config-merger');
const argv = require('minimist')(process.argv);
const isDevelop = argv.d !== undefined;
const serverBase = isDevelop ? 'http://localhost:8080/api' : 'api';
const webpack = require('webpack');
const pkgConfig = require('./package.json');

const srcRegexp = /src.components.*\.js$/;

const webpackConfig = webpackConfigMerger(
  require('ring-ui/webpack.config'),
  {
    entry: `${pkgConfig.config.src}/components/app/app.js`,
    output: {
      path: pkgConfig.config.dist,
      filename: '[name].js',
      library: '[name]',
      libraryTarget: 'umd'
    },
    module: {
      loaders: [
        {
          test: srcRegexp,
          loaders: ['babel-loader?experimental&optional=runtime']
        },
        {test: /.*\/app\/.*\.html$/, loader: 'html'}
      ]
    }
  }, {
    plugins: [
      new HtmlWebpackPlugin({
        template: 'src/index.html'
      }),
      new webpack.DefinePlugin({
        AppBuildConfig: {
          version: JSON.stringify(process.env['version.number'] || 'dev'),
          number: JSON.stringify(process.env.BUILD_NUMBER || 'dev'),
          backendUrl: JSON.stringify(serverBase)
        }
      }),
      new webpack.optimize.DedupePlugin()
    ]
  });

module.exports = webpackConfig;
