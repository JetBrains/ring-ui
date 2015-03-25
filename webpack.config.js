/* eslint-env node */
/*
 * Webpack development server configuration
 *
 * This file is set up for serving the webpak-dev-server, which will watch for changes and recompile as required if
 * the subfolder /webpack-dev-server/ is visited. Visiting the root will not automatically reload.
 */

var pkgConfig = require('./package.json');
var path = require('path');

module.exports = {
  entry: {
    ring: path.resolve(pkgConfig.config.src, pkgConfig.main),
    ring2: path.resolve(pkgConfig.config.src, 'ring-upsource.js')
  },
  output: {
    path: pkgConfig.dist,
    filename: '[name].js',
    library: '[name]',
    libraryTarget: 'umd'
  },
  externals: {
    'jquery': 'jQuery'
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    fallback: [
      path.join(__dirname, 'components')
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
          'sass?outputStyle=expanded&includePaths[]=' + (path.resolve(__dirname, './components'))
        ]
      },
      // import codemirror's plain styles
      {
        test: /codemirror\.css$/,
        loaders: [
          'style',
          'css'
        ]
      },
      // shim whatwg fetch polyfill
      {
        test: /whatwg\-fetch\/fetch\.js$/,
        loaders: [
          'imports?self=>{},Promise=when/es6-shim/Promise.browserify-es6.js',
          'exports?self'
        ]
      },
      //ng-annotate loader for angular components
      {
        test: /(-ng)(\\|\/)\S*(-ng|-ng__)\S*\.js$/,
        loader: 'ng-annotate'
      },
      //jsx loader
      {
        test: /\.jsx$/,
        loader: 'jsx-loader'
      },
      { test: /\.html$/, loader: 'html-loader' },
      //images loader
      { test: /\.png$/, loader: 'url-loader?limit=10000' },
      { test: /\.gif$/, loader: 'url-loader?limit=10000' },
      // the url-loader uses DataUrls.
      // the file-loader emits files.
      { test: /\.woff$/, loader: 'url-loader?limit=10000&minetype=application/font-woff' },
      { test: /\.ttf$/, loader: 'file-loader' },
      { test: /\.eot$/, loader: 'file-loader' },
      { test: /\.svg$/, loader: 'url-loader?limit=10000' }
    ]
  },
  plugins: []
};
