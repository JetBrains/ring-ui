/* eslint-env node */
var path = require('path');
var webpack = require('webpack');

var componentsPath = path.join(__dirname, 'components');
var nodeModulesPath = path.join(__dirname, 'node_modules');
var buildPath = [
  componentsPath,
  path.join(__dirname, 'docs'),
  path.join(__dirname, 'site')
];
var iconPath = [
  path.join(__dirname, 'components/icon/source'),
  path.join(__dirname, 'node_modules/jetbrains-logos')
];

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
        test: /\.svg$/,
        loaders: [
          'svg-sprite?angularBaseWorkaround',
          'svgo'
        ],
        include: iconPath
      },
      {
        test: /\.scss$/,
        include: buildPath,
        loaders: [
          'style',
          'css',
          // TODO Update autoprefixer config and move to postcss-loader
          'autoprefixer?browsers=last 2 versions, safari 5, ie 8, ie 9, opera 12.1, ios 6, android 4',
          'sass?outputStyle=expanded&includePaths[]=' + componentsPath
        ]
      },
      // import plain styles from modules for docsite
      {
        test: /\.css$/,
        include: nodeModulesPath,
        loaders: [
          'style',
          'css'
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
        include: buildPath,
        loader: 'babel-loader'
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
  plugins: [
    new webpack.ProvidePlugin({
      'Promise': 'core-js/es6/promise',
      'fetch': 'exports?self.fetch!whatwg-fetch'
    })
  ]
};
