/* eslint-env node */
/* eslint-disable modules/no-cjs */

const path = require('path');

const componentsPath = [path.join(__dirname, 'components')];

function resolveLoader(loader) {
  return require.resolve(`${loader}-loader`);
}

const htmlLoaderOptions = `?${JSON.stringify({
  interpolate: true,
  collapseBooleanAttributes: false,
  attrs: 'span:react-value-glyph rg-icon:glyph',
  root: require('jetbrains-icons')
})}`;

const svgSpriteLoader = {
  test: /\.svg$/,
  loaders: [
    `${resolveLoader('svg-sprite')}?angularBaseWorkaround`
  ],
  include: [require('jetbrains-logos'), require('jetbrains-icons')]
};

const svgLoader = {
  test: /\.svg$/,
  loaders: [
    `${resolveLoader('url')}?limit=10000`
  ],
  include: componentsPath
};

const scssLoader = {
  test: /\.scss$/,
  include: componentsPath,
  loaders: [
    resolveLoader('style'),
    resolveLoader('css'),
    resolveLoader('postcss'),
    `${resolveLoader('sass')}?outputStyle=expanded&includePaths[]=${componentsPath[0]}`
  ]
};

const cssLoader = {
  test: /\.css$/,
  include: componentsPath,
  loaders: [
    resolveLoader('style'),
    `${resolveLoader('css')}?modules&importLoaders=1&localIdentName=[name]__[local]__[hash:base64:7]')`,
    resolveLoader('postcss')
  ]
};

// ng-annotate loader for angular components
const ngAnnotateLoader = {
  test: /-ng(\\|\/)\S*(-ng|-ng__)\S*\.js$/,
  include: componentsPath,
  loader: resolveLoader('ng-annotate')
};

const babelLoader = {
  test: /\.js$/,
  include: componentsPath,
  loader: `${resolveLoader('babel')}?cacheDirectory=true`
};

const jsonLoader = {
  test: /\.json$/,
  include: componentsPath,
  loader: resolveLoader('json')
};

const whatwgLoader = {
  test: require.resolve('whatwg-fetch'),
  loader: `${resolveLoader('imports')}?Promise=core-js/es6/promise`
};

const htmlLoader = {
  test: /-ng(\\|\/)\S*(-ng|-ng__)\S*\.html$/,
  include: componentsPath,
  loader: resolveLoader('html') + htmlLoaderOptions
};

const gifLoader = {
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
      cssLoader,
      scssLoader,
      ngAnnotateLoader,
      babelLoader,
      jsonLoader,
      whatwgLoader,
      htmlLoader,
      gifLoader
    ]
  },

  componentsPath,

  svgSpriteLoader,
  svgLoader,
  cssLoader,
  scssLoader,
  ngAnnotateLoader,
  babelLoader,
  whatwgLoader,
  htmlLoader,
  gifLoader
};
