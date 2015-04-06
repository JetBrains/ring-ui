/*
 * Webpack development server configuration
 *
 * This file is set up for serving the webpak-dev-server, which will watch for changes and recompile as required if
 * the subfolder /webpack-dev-server/ is visited. Visiting the root will not automatically reload.
 */

var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpackConfigMerger = require('webpack-config-merger');
var argv = require('minimist')(process.argv);
var isDevelop = argv.d !== undefined;
var serverBase = isDevelop ? 'http://localhost:8080/api' : 'api';
var webpack = require('webpack');
var pkgConfig = require('./package.json');

//noinspection CodeAssistanceForRequiredModule

var srcRegexp = /src.blocks.*\.js$/;

var webpackConfig = webpackConfigMerger(
  require('ring-ui/webpack.config'),
  {
    entry: pkgConfig.src + '/blocks/app/app.js',
    output: {
      path: pkgConfig.dist,
      filename: '[name].js',
      library: '[name]',
      libraryTarget: 'umd'
    },
    externals: {
      'jquery': false
    },
    module: {
      loaders: [
        {
          test: srcRegexp,
          loaders: [<% if (useAngular){ %>'ng-annotate'<% } %>, 'babel-loader?experimental&optional=runtime']
        }
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
          number: JSON.stringify(process.env['BUILD_NUMBER'] || 'dev'),
          backendUrl: JSON.stringify(serverBase)
        }
      }),
      new webpack.optimize.DedupePlugin()
    ]
  });

module.exports = webpackConfig;
