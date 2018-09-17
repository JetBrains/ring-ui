const path = require('path');

const componentsPath = [path.join(__dirname, 'components')];

const variables = require('./extract-css-vars');

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
  root: require('@jetbrains/icons')
})}`;

const svgSpriteLoader = {
  test: /\.svg$/,
  use: [
    {
      loader: resolveLoader('svg-sprite'),
      options: {
        extract: false,
        runtimeCompat: true,
        esModule: false,
        symbolId: 'ring-icon-[name]'
      }
    }
  ],
  include: [require('@jetbrains/icons')]
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
    {
      loader: resolveLoader('postcss'),
      options: {
        config: {
          ctx: {variables}
        }
      }
    },
    {
      loader: `${resolveLoader('sass')}?outputStyle=expanded`,
      options: {
        implementation: require('sass') // Dart implementation of SASS compiler
      }
    }
  ]
};

const cssLoader = {
  test: /\.css$/,
  include: componentsPath,
  use: [
    resolveLoader('style'),
    {
      loader: resolveLoader('css'),
      options: {
        modules: true,
        importLoaders: 1,
        localIdentName: '[local]_[hash:3]'
      }
    },
    {
      loader: resolveLoader('postcss'),
      options: {
        config: {
          ctx: {variables}
        }
      }
    }
  ]
};

const externalCssLoader = {
  test: /\.css$/,
  include: [
    path.dirname(require.resolve('highlight.js/package.json'))
  ],
  use: [
    resolveLoader('style'),
    resolveLoader('css')
  ]
};

const babelLoader = {
  test: /\.js$/,
  include: componentsPath,
  loader: `${resolveLoader('babel')}?${JSON.stringify({
    configFile: path.join(__dirname, '.babelrc'),
    cacheDirectory: true
  })}`
};

const whatwgLoader = {
  test: require.resolve('whatwg-fetch'),
  loader: resolveLoader('imports')
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
