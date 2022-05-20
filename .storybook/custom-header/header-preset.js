/**
 * Storybook preset that patches manager's webpack config to enable loading Ring UI components
 */
const path = require('path');

const webpack = require('webpack');

const pkgConfig = require('../../package.json').config;
const ringConfig = require('../../webpack.config').createConfig();

exports.managerWebpack = function managerWebpack(config) {
  ringConfig.componentsPath.push(
    path.resolve(__dirname, '..'),
    path.resolve(__dirname, '../../src')
  );
  const svgLoader = {
    test: /\.svg$/,
    loader: require.resolve('svg-inline-loader'),
    options: {removeSVGTagAttrs: false},
    include: [/@primer\/octicons/, /@jetbrains\/logos/]
  };
  config.module.rules.forEach(rule => {
    rule.exclude = ringConfig.componentsPath.
      concat(rule.exclude || []).
      concat(svgLoader.include);
  });

  const serverUri = pkgConfig.hub;
  const clientId = pkgConfig.clientId;
  const hubConfig = JSON.stringify({serverUri, clientId});

  return {
    ...config,
    entry: [
      ...config.entry,
      require.resolve('./custom-header.tsx')
    ],
    module: {
      ...config.module,
      rules: [
        ...config.module.rules,
        ...ringConfig.config.module.rules,
        svgLoader
      ]
    },
    plugins: [
      ...config.plugins,
      new webpack.DefinePlugin({hubConfig})
    ]
  };
};
