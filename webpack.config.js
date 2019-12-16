const path = require('path');

const componentsPath = [path.join(__dirname, 'components')];

function loadersObjectToArray(loaders) {
  return Object.keys(loaders).map(name => loaders[name]);
}

const svgInlineLoader = {
  test: /\.svg$/,
  loader: require.resolve('svg-inline-loader'),
  options: {removeSVGTagAttrs: false},
  include: [require('@jetbrains/icons')]
};

const svgSpriteLoaderBackwardCompatibilityHack = {
  get include() {
    throw new Error(`
***
  ERROR: Ring UI svgSpriteLoader is REMOVED in 2.0.0. Looks like your webpack config is patching it.
  The most simple fix is to replace "svgSpriteLoader.include.push(...)" with "svgInlineLoader.include.push(...)"
  Please consider using your own "svg-inline-loader". More details: https://youtrack.jetbrains.com/issue/RG-1646
***
    `);
  }
};

const svgLoader = {
  test: /\.svg$/,
  loader: `${require.resolve('url-loader')}?limit=10000`,
  include: componentsPath
};

const scssLoader = {
  test: /\.scss$/,
  include: componentsPath,
  use: [
    require.resolve('style-loader'),
    require.resolve('css-loader'),
    {
      loader: require.resolve('postcss-loader')
    },
    {
      loader: `${require.resolve('sass-loader')}?outputStyle=expanded`,
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
    require.resolve('style-loader'),
    {
      loader: require.resolve('css-loader'),
      options: {
        modules: {
          localIdentName: '[local]_[hash:3]'
        },
        importLoaders: 1
      }
    },
    {
      loader: require.resolve('postcss-loader')
    }
  ]
};

const externalCssLoader = {
  test: /\.css$/,
  include: [
    path.dirname(require.resolve('highlight.js/package.json'))
  ],
  use: [
    require.resolve('style-loader'),
    require.resolve('css-loader')
  ]
};

const babelLoader = {
  test: /\.js$/,
  include: componentsPath,
  loader: require.resolve('babel-loader'),
  options: {
    configFile: path.join(__dirname, 'babel.config.js'),
    cacheDirectory: true
  }
};

const whatwgLoader = {
  test: require.resolve('whatwg-fetch'),
  loader: require.resolve('imports-loader')
};

const htmlLoader = {
  test: /-ng(\\|\/)\S*(-ng|-ng__)\S*\.html$/,
  include: componentsPath,
  loader: require.resolve('html-loader'),
  query: {
    collapseBooleanAttributes: false
  }
};

const gifLoader = {
  test: /\.gif$/,
  include: componentsPath,
  loader: require.resolve('url-loader')
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
