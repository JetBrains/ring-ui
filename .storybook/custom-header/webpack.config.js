/**
 * Storybook preset that patches manager's webpack config to enable loading Ring UI components
 */
const path = require('path');
const webpack = require('webpack');

const pkgConfig = require('../../package.json').config;
const ringConfig = require('../../webpack.config').createConfig();

ringConfig.componentsPath.push(path.resolve(__dirname, '..'), path.resolve(__dirname, '../../src'));
const svgLoader = {
  test: /\.svg$/,
  loader: require.resolve('svg-inline-loader'),
  options: {removeSVGTagAttrs: false},
  include: [/@primer\/octicons/, /@jetbrains\/logos/],
};

const serverUri = pkgConfig.hub;
const clientId = pkgConfig.clientId;
const hubConfig = JSON.stringify({serverUri, clientId});

module.exports = {
  ...ringConfig.config,
  mode: 'development',
  entry: [require.resolve('./custom-header.tsx')],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'custom-header.js',
  },
  module: {
    rules: [...ringConfig.config.module.rules, svgLoader],
  },
  plugins: [new webpack.DefinePlugin({hubConfig})],
};
