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
  loader: `${resolveLoader('svg-sprite')}?angularBaseWorkaround`,
  include: [require('jetbrains-logos'), require('jetbrains-icons')]
};

const svgLoader = {
  test: /\.svg$/,
  loader: `${resolveLoader('url')}?limit=10000`,
  include: componentsPath
};

const scssLoader = {
  test: /\.scss$/,
  include: componentsPath,
  use: [
    resolveLoader('style'),
    resolveLoader('css'),
    resolveLoader('postcss'),
    `${resolveLoader('sass')}?outputStyle=expanded`
  ]
};

const cssLoader = {
  test: /\.css$/,
  include: componentsPath,
  use: [
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
  use: [
    resolveLoader('style'),
    resolveLoader('css')
  ]
};

const babelLoader = {
  test: /\.js$/,
  include: componentsPath,
  loader: `${resolveLoader('babel')}?cacheDirectory`
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
  babelLoader,
  whatwgLoader,
  htmlLoader,
  gifLoader
};

// Minimal config for building components
module.exports = {
  config: {
    module: {
      rules: loadersObjectToArray(loaders)
    }
  },

  componentsPath,

  loaders
};
