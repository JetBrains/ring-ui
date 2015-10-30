/* eslint-env node */
/* eslint-disable no-var*/

var path = require('path');
var webpack = require('webpack');

var componentsPath = path.join(__dirname, 'components');

function resolveLoader(loader) {
  return require.resolve(loader + '-loader');
}

// Minimal config for building components
module.exports = {
  module: {
    loaders: [
      {
        test: /\.svg$/,
        loaders: [
          resolveLoader('svg-sprite') + '?angularBaseWorkaround',
          resolveLoader('svgo') + '?useConfig=RingSVGOConfig'
        ],
        include: [require('jetbrains-logos'), require('jetbrains-icons')]
      },
      {
        test: /\.scss$/,
        include: componentsPath,
        loaders: [
          resolveLoader('style'),
          resolveLoader('css'),
          // TODO Update autoprefixer config and move to postcss-loader
          resolveLoader('autoprefixer') + '?browsers=last 2 versions, safari 5, ie 8, ie 9, opera 12.1, ios 6, android 4',
          resolveLoader('sass') + '?outputStyle=expanded&includePaths[]=' + componentsPath
        ]
      },
      // ng-annotate loader for angular components
      {
        test: /-ng(\\|\/)\S*(-ng|-ng__)\S*\.js$/,
        include: componentsPath,
        loader: resolveLoader('ng-annotate')
      },
      {
        test: /\.js$/,
        include: componentsPath,
        loader: resolveLoader('babel')
      },
      {
        test: /-ng(\\|\/)\S*(-ng|-ng__)\S*\.html$/,
        include: componentsPath,
        loader: resolveLoader('html')
      },
      {
        test: /\.gif$/,
        include: componentsPath,
        loader: resolveLoader('url')
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      Promise: 'core-js/es6/promise', // required for fetch
      fetch: 'exports?self.fetch!whatwg-fetch'
    })
  ],
  // We have to share this config because SVG breaks with different configs in one process
  RingSVGOConfig: {
    full: true, // We have to set full list plugins to make configuration work
    // Deafult list of plugins
    plugins: [
      'convertStyleToAttrs', // Should be first in list
      {removeUselessStrokeAndFill: {fill: false}}, // Disable black fill removal
      'removeDoctype',
      'removeXMLProcInst',
      'removeComments',
      'removeMetadata',
      'removeEditorsNSData',
      'cleanupAttrs',
      'cleanupIDs',
      'removeUselessDefs',
      'cleanupNumericValues',
      'cleanupListOfValues',
      'convertColors',
      'removeUnknownsAndDefaults',
      'removeNonInheritableGroupAttrs',
      'cleanupEnableBackground',
      'removeHiddenElems',
      'removeEmptyText',
      'convertShapeToPath',
      'moveElemsAttrsToGroup',
      'moveGroupAttrsToElems',
      'collapseGroups',
      'convertPathData',
      'convertTransform',
      'removeEmptyAttrs',
      'removeEmptyContainers',
      'mergePaths',
      'removeUnusedNS',
      'removeDesc'
    ]
  }
};
