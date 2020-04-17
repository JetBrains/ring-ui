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
    '@storybook/addon-docs',
    '@storybook/addon-notes',
    '@storybook/addon-storysource',
    '@storybook/addon-actions',
    '@storybook/addon-knobs',
    '@storybook/addon-a11y'
  ],
  webpackFinal(config) {
    ringConfig.loaders.cssLoader.include.push(/\.storybook/);
    ringConfig.loaders.svgInlineLoader.include.push(/octicons/);
    ringConfig.loaders.svgInlineLoader.include.push(/@jetbrains\/logos/);
    ringConfig.loaders.babelLoader.options.plugins = [[
      'babel-plugin-react-docgen',
      {
        DOC_GEN_COLLECTION_NAME: 'STORYBOOK_REACT_CLASSES'
      }
    ]];

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

    return config;
  }
};
