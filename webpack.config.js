const path = require('path');

function loadersObjectToArray(loaders) {
  return Object.keys(loaders).map(name => loaders[name]);
}

function createConfig() {
  const componentsPath = [path.join(__dirname, 'components')];

  const cssLoader = {
    test: /\.css$/,
    include: componentsPath,
    use: [
      {
        loader: require.resolve('style-loader'),
        options: {
          esModule: false,
        },
      },
      {
        loader: require.resolve('css-loader'),
        options: {
          modules: {
            namedExport: false,
            exportLocalsConvention: 'as-is',
            localIdentName: '[local]_[hash:4]',
          },
          importLoaders: 1,
        },
      },
      {
        loader: require.resolve('postcss-loader'),
        options: {
          implementation: require('postcss'),
        },
      },
    ],
  };

  const externalCssLoader = {
    test: /\.css$/,
    include: [path.dirname(require.resolve('highlight.js/package.json'))],
    use: [require.resolve('style-loader'), require.resolve('css-loader')],
  };

  const babelLoader = {
    test: /\.[jt]sx?$/,
    sideEffects: false,
    include: componentsPath,
    loader: require.resolve('babel-loader'),
    options: {
      configFile: path.join(__dirname, 'babel.config.js'),
      cacheDirectory: true,
    },
  };

  const gifLoader = {
    test: /\.gif$/,
    include: componentsPath,
    loader: require.resolve('url-loader'),
  };

  const loaders = {
    cssLoader,
    externalCssLoader,
    babelLoader,
    gifLoader,
  };

  return {
    // Minimal config for building components
    config: {
      module: {
        rules: loadersObjectToArray(loaders),
      },
      resolve: {
        extensions: ['.js', '.ts', '.tsx'],
      },
    },
    componentsPath,
    loaders,
  };
}

const {config, componentsPath, loaders} = createConfig();

module.exports = {
  createConfig,
  config,
  componentsPath,
  loaders,
};
