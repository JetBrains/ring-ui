/*
 * Webpack development server configuration
 *
 * This file is set up for serving the webpak-dev-server, which will watch for changes and recompile as required if
 * the subfolder /webpack-dev-server/ is visited. Visiting the root will not automatically reload.
 */

'use strict';
var pkgConfig = require('./package.json');
var path = require('path');
var addLoaders = function() {
  return Array.prototype.slice.call(arguments).join('!');
};

module.exports = {
  entry: {
    Ring: path.resolve(pkgConfig.src, 'ring.js')
  },
  output: {
    path: pkgConfig.dist,
    filename: '[name].js',
    library: '[name]'
  },
  externals: {
    'jquery': 'jQuery'
  },
  cache: true,
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loader: addLoaders(
            'style',
            'css',
            'autoprefixer?browsers=last 2 versions, safari 5, ie 8, ie 9, opera 12.1, ios 6, android 4',
            'sass?outputStyle=expanded'
        )
      },
      //jsx loader
      {
        test: /\.jsx$/,
        loader: 'jsx-loader'
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
