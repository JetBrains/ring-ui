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

function resolveLoader(loader) {
  return require.resolve(loader + '-loader');
}

// Minimal config for building components
module.exports = {
  resolve: {
    fallback: [componentsPath]
  },
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
        include: buildPath,
        loaders: [
          resolveLoader('style'),
          resolveLoader('css'),
          // TODO Update autoprefixer config and move to postcss-loader
          resolveLoader('autoprefixer') + '?browsers=last 2 versions, safari 5, ie 8, ie 9, opera 12.1, ios 6, android 4',
          resolveLoader('sass') + '?outputStyle=expanded&includePaths[]=' + componentsPath
        ]
      },
      // import plain styles from modules for docsite
      {
        test: /\.css$/,
        include: nodeModulesPath,
        loaders: [
          resolveLoader('style'),
          resolveLoader('css')
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
        include: buildPath,
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
