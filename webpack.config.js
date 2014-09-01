/*
 * Webpack development server configuration
 *
 * This file is set up for serving the webpak-dev-server, which will watch for changes and recompile as required if
 * the subfolder /webpack-dev-server/ is visited. Visiting the root will not automatically reload.
 */

'use strict';
var pkgConfig = require('./package.json');
var path = require('path');

module.exports = {
  entry: {
    ring: path.resolve(pkgConfig.src, pkgConfig.main)
  },
  output: {
    path: pkgConfig.dist,
    filename: '[name].js',
    library: '[name]',
    libraryTarget: 'umd'
  },
  externals: {
    'jquery': 'jQuery',
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      'mousetrap': 'Mousetrap'
    },
    fallback: [
      path.join(__dirname, 'components'),
      path.join(__dirname, 'src/components')
    ]
  },
  resolveLoader: {
    fallback: path.join(__dirname, 'node_modules')
  },
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loaders: [
          'style',
          'css',
          'autoprefixer?browsers=last 2 versions, safari 5, ie 8, ie 9, opera 12.1, ios 6, android 4',
          'sass?outputStyle=expanded'
        ]
      },
      //jsx loader
      {
        test: /\.jsx$/,
        loader: 'jsx-loader'
      },
      {
        test: /\.mousetrap.js$/,
        loader: 'imports-loader?window=>{}!exports-loader?window.Mousetrap'
      },
      //images loader
      { test: /\.png$/, loader: 'file-loader' },
      // the url-loader uses DataUrls.
      // the file-loader emits files.
      { test: /\.woff$/, loader: 'url-loader?limit=10000&minetype=application/font-woff' },
      { test: /\.ttf$/, loader: 'file-loader' },
      { test: /\.eot$/, loader: 'file-loader' },
      { test: /\.svg$/, loader: 'file-loader' }
    ]
  },
  plugins: []
};
