const path = require('path');

const webpack = require('webpack');

const ringConfig = require('../webpack.config');
const pkgConfig = require('../package.json').config;

module.exports = {
  stories: [
    // Make welcome stories default
    '../components/welcome.examples.js',
    '../components/**/*.examples.js'
  ],
  presets: [require.resolve('./custom-header/header-preset')],
  addons: [
    '@storybook/addon-storysource',
    '@storybook/addon-essentials',
    '@storybook/addon-a11y'
  ],
  webpackFinal(config) {
    ringConfig.loaders.babelLoader.options.plugins = [[
      'babel-plugin-react-docgen',
      {
        DOC_GEN_COLLECTION_NAME: 'STORYBOOK_REACT_CLASSES'
      }
    ]];

    ringConfig.config.module.rules.push({
      test: /\.svg$/,
      loader: require.resolve('svg-inline-loader'),
      options: {removeSVGTagAttrs: false},
      include: [/@primer\/octicons/, /@jetbrains\/logos/]
    });

    config.module.rules = [
      ...ringConfig.config.module.rules,
      config.module.rules.find(rule =>
        rule.include instanceof RegExp &&
        rule.include.test('node_modules/acorn-jsx')),
      {
        test: /\.md$/,
        loader: 'raw-loader'
      },
      {
        test: /\.examples\.js$/,
        loaders: [require.resolve('@storybook/source-loader')],
        enforce: 'pre'
      }
    ];

    const serverUri = pkgConfig.hub;
    const clientId = pkgConfig.clientId;
    const hubConfig = JSON.stringify({serverUri, clientId});

    config.plugins.push(new webpack.DefinePlugin({hubConfig}));

    config.resolve.alias['@jetbrains/ring-ui'] = path.resolve(__dirname, '..');
    config.node = {
      Buffer: false,
      process: false
    };

    return config;
  }
};
