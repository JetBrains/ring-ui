/* eslint-env node */

const path = require('path');

const componentsPath = [path.join(__dirname, 'components')];

function resolveLoader(loader) {
  return require.resolve(`${loader}-loader`);
}

function loadersObjectToArray(loaders) {
  return Object.keys(loaders).map(name => loaders[name]);
}

const htmlLoaderOptions = `?${JSON.stringify({
  interpolate: true,
  collapseBooleanAttributes: false,
  attrs: 'rg-icon:glyph',
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
    `${resolveLoader('sass')}?outputStyle=expanded`
  ]
};

const cssLoader = {
  test: /\.css$/,
  include: componentsPath,
  loaders: [
    resolveLoader('style'),
    `${resolveLoader('css')}?modules&importLoaders=1&localIdentName=[local]_[hash:3]')`,
    resolveLoader('postcss')
  ]
};

const externalCssLoader = {
  test: /\.css$/,
  include: [
    path.resolve('./node_modules/highlight.js')
  ],
  loaders: [
    resolveLoader('style'),
    resolveLoader('css')
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

const loaders = {
  svgSpriteLoader,
  svgLoader,
  cssLoader,
  externalCssLoader,
  scssLoader,
  ngAnnotateLoader,
  babelLoader,
  whatwgLoader,
  htmlLoader,
  gifLoader
};

// Minimal config for building components
module.exports = {
  config: {
    module: {
      // webpack 1
      loaders: loadersObjectToArray(loaders),

      // webpack 2
      rules: loadersObjectToArray(loaders)
    }
  },

  componentsPath,

  loaders
};
