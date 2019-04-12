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
  root: require('@jetbrains/icons')
})}`;

const svgInlineLoader = {
  test: /\.svg$/,
  loader: resolveLoader('svg-inline'),
  options: {removeSVGTagAttrs: false},
  include: [require('@jetbrains/icons')]
};

const svgSpriteLoaderBackwardCompatibilityHack = {
  get include() {
    throw new Error(`
***
  ERROR: Ring UI svgSpriteLoader is REMOVED in 2.0.0. Looks like your webpack config is patching it.
  Most simple solution is to rename "svgSpriteLoader.include.push(...)" => "svgInlineLoader.include.push(...)"
  Please consider having own "svg-inline-loader". More details https://youtrack.jetbrains.com/issue/RG-1646
***
    `);
  }
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
      loader: resolveLoader('postcss')
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
      loader: resolveLoader('postcss')
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
  svgInlineLoader,
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

  loaders: {
    ...loaders,
    svgSpriteLoader: svgSpriteLoaderBackwardCompatibilityHack
  }
};
