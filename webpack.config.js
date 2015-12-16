/* eslint-env node */
/* eslint-disable no-var */
/* eslint-disable modules/no-cjs */

var path = require('path');

var componentsPath = path.join(__dirname, 'components');

function resolveLoader(loader) {
  return require.resolve(loader + '-loader');
}

var htmlLoaderOptions = '?' + JSON.stringify({
  collapseBooleanAttributes: false,
  attrs: 'span:react-value-glyph',
  root: require('jetbrains-icons')
});

// Minimal config for building components
module.exports = {
  module: {
    loaders: [
      {
        test: /\.svg$/,
        loaders: [
          resolveLoader('svg-sprite') + '?angularBaseWorkaround'
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
        loader: resolveLoader('babel') + '?cacheDirectory=true'
      },
      {
        test: require.resolve('whatwg-fetch'),
        loader: resolveLoader('imports') + '?Promise=core-js/es6/promise'
      },
      {
        test: /-ng(\\|\/)\S*(-ng|-ng__)\S*\.html$/,
        include: componentsPath,
        loader: resolveLoader('html') + htmlLoaderOptions
      },
      {
        test: /\.gif$/,
        include: componentsPath,
        loader: resolveLoader('url')
      }
    ]
  }
};
