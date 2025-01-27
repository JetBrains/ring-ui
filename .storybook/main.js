const path = require('path');

const webpack = require('webpack');

const ringConfig = require('../webpack.config').createConfig();
const pkgConfig = require('../package.json').config;

module.exports = {
  stories: [
    // Make welcome stories default
    '../src/welcome.stories.tsx',
    '../src/**/*.stories.{js,ts,tsx}',
  ],
  addons: [
    {
      name: '@storybook/addon-essentials',
      options: {
        actions: false,
        docs: true,
      },
    },
    '@storybook/addon-a11y',
    '@storybook/addon-themes',
  ],
  webpackFinal(config) {
    ringConfig.componentsPath.push(__dirname, path.resolve(__dirname, '../src'));

    config.module.rules = [
      ...ringConfig.config.module.rules,
      config.module.rules.find(rule => /react-docgen-loader\.js$/.test(rule.loader)),
      {
        test: /\.md$/,
        loader: 'raw-loader',
      },
      {
        test: /\.svg$/,
        loader: require.resolve('svg-inline-loader'),
        options: {removeSVGTagAttrs: false},
        include: [/@primer\/octicons/, /@jetbrains\/logos/],
      },
      {
        test: /\.png$/,
        type: 'asset/resource',
      },
      {test: /\.m?js$/, resolve: {fullySpecified: false}},
    ];

    const serverUri = pkgConfig.hub;
    const clientId = pkgConfig.clientId;
    const hubConfig = JSON.stringify({serverUri, clientId});

    config.plugins.push(new webpack.DefinePlugin({hubConfig}));

    return config;
  },
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  docs: {
    autodocs: true,
  },
  staticDirs: ['./custom-header/dist'],
  typescript: {
    reactDocgen: 'react-docgen',
  },
};
