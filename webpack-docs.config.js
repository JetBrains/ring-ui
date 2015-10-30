/* eslint-env node */
var path = require('path');
var webpack = require('webpack');
var chalk = require('chalk');

var webpackConfigMerger = require('webpack-config-merger');
var webpackConfig = require('./webpack.config');
var AnyBarWebpackPlugin = require('anybar-webpack');

var isServer = process.argv.indexOf('--server') !== -1;

var nodeModulesPath = path.join(__dirname, 'node_modules');
var sitePath = [
  path.join(__dirname, 'docs'),
  path.join(__dirname, 'site')
];
var publicPath = '/assets/';

module.exports = webpackConfigMerger(webpackConfig, {
  entry: {
    index: './site/'
  },
  externals: {
    jquery: false
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
    path: path.resolve(__dirname, '..', 'docs', 'assets'),
    pathinfo: isServer,
    filename: '[name].js',
    publicPath: publicPath // serve HMR update json's properly
  },
  plugins: isServer ? [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new AnyBarWebpackPlugin(),
    /** Build progress informer */
      function () {
      var timeMeasureMessage = chalk.blue('Compilation finished in');

      this.plugin('compile', function () {
        console.time(timeMeasureMessage);
        console.log(chalk.green('Compilation started...', (new Date()).toTimeString()));
      });
      this.plugin('done', function (stats) {
        if (stats.hasErrors) {
          console.error(chalk.red(stats.toJson().errors.join('\n')));
        }
        console.timeEnd(timeMeasureMessage);
      });
    }
  ] : []
});
