/* eslint-env node */
var path = require('path');

var componentsPath = path.join(__dirname, 'components');
var nodeModulesPath = path.join(__dirname, 'node_modules');
var docsPath = [path.join(__dirname, 'docs'), path.join(__dirname, 'site')];

// Minimal config for building components
module.exports = {
  resolve: {
    fallback: [componentsPath]
  },
  resolveLoader: {
    fallback: [nodeModulesPath]
  },
  module: {
    loaders: [
      {
        test: /\.scss$/,
        include: docsPath.concat(componentsPath),
        loaders: [
          'style',
          'css',
          // TODO Update autoprefixer config and move to postcss-loader
          'autoprefixer?browsers=last 2 versions, safari 5, ie 8, ie 9, opera 12.1, ios 6, android 4',
          'sass?outputStyle=expanded&includePaths[]=' + componentsPath
        ]
      },
      // import plain styles from modules
      // used for codemirror and docsite
      {
        test: /\.css$/,
        include: nodeModulesPath,
        loaders: [
          'style',
          'css'
        ]
      },
      // shim whatwg fetch polyfill
      // TODO Reconsider polyfills https://gist.github.com/darklight721/f2c8d496529738586c68
      {
        test: /whatwg\-fetch(\\|\/)fetch\.js$/,
        include: nodeModulesPath,
        loaders: [
          'imports?self=>{},Promise=babel-runtime/node_modules/core-js/es6/promise',
          'exports?self'
        ]
      },
      // ng-annotate loader for angular components
      {
        test: /-ng(\\|\/)\S*(-ng|-ng__)\S*\.js$/,
        include: componentsPath,
        loader: 'ng-annotate'
      },
      {
        test: /\.js$/,
        include: componentsPath,
        loader: 'babel-loader',
        query: {stage: 0}
      },
      { test: /-ng(\\|\/)\S*(-ng|-ng__)\S*\.html$/,
        include: componentsPath,
        loader: 'html-loader'
      },
      // Bundle all gifs
      { test: /\.gif$/,
        loader: 'url-loader'
      }
    ]
  },
  // Keep empty plugins list to simplify additions
  plugins: []
};
