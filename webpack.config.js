/* eslint-env node */
/* eslint-disable no-var */
/* eslint-disable modules/no-cjs */

var path = require('path');
var autoprefixer = require('autoprefixer');

var componentsPath = [path.join(__dirname, 'components')];

function resolveLoader(loader) {
  return require.resolve(loader + '-loader');
}

var htmlLoaderOptions = '?' + JSON.stringify({
  collapseBooleanAttributes: false,
  attrs: 'span:react-value-glyph rg-icon:glyph',
  root: require('jetbrains-icons')
});

var svgSpriteLoader = {
  test: /\.svg$/,
  loaders: [
    resolveLoader('svg-sprite') + '?angularBaseWorkaround'
  ],
  include: [require('jetbrains-logos'), require('jetbrains-icons')]
};

var svgLoader = {
  test: /\.svg$/,
  loaders: [
    resolveLoader('url') + '?limit=10000'
  ],
  include: componentsPath
};

var scssLoader = {
  test: /\.scss$/,
  include: componentsPath,
  loaders: [
    resolveLoader('style'),
    resolveLoader('css'),
    resolveLoader('postcss') + '?pack=ring-ui',
    resolveLoader('sass') + '?outputStyle=expanded&includePaths[]=' + componentsPath
  ]
};

// ng-annotate loader for angular components
var ngAnnotateLoader = {
  test: /-ng(\\|\/)\S*(-ng|-ng__)\S*\.js$/,
  include: componentsPath,
  loader: resolveLoader('ng-annotate')
};

var babelLoader = {
  test: /\.js$/,
  include: componentsPath,
  loader: resolveLoader('babel') + '?cacheDirectory=true'
};

var whatwgLoader = {
  test: require.resolve('whatwg-fetch'),
  loader: resolveLoader('imports') + '?Promise=core-js/es6/promise'
};

var htmlLoader = {
  test: /-ng(\\|\/)\S*(-ng|-ng__)\S*\.html$/,
  include: componentsPath,
  loader: resolveLoader('html') + htmlLoaderOptions
};

var gifLoader = {
  test: /\.gif$/,
  include: componentsPath,
  loader: resolveLoader('url')
};

// Minimal config for building components
module.exports = {
  module: {
    loaders: [
      svgSpriteLoader,
      svgLoader,
      scssLoader,
      ngAnnotateLoader,
      babelLoader,
      whatwgLoader,
      htmlLoader,
      gifLoader
    ]
  },

  postcss: {
    'ring-ui': [autoprefixer]
  },
  componentsPath: componentsPath,

  svgSpriteLoader: svgSpriteLoader,
  svgLoader: svgLoader,
  scssLoader: scssLoader,
  ngAnnotateLoader: ngAnnotateLoader,
  babelLoader: babelLoader,
  whatwgLoader: whatwgLoader,
  htmlLoader: htmlLoader,
  gifLoader: gifLoader
};
