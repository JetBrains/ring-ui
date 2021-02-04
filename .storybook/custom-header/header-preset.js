/**
 * Storybook preset that patches manager's webpack config to enable loading Ring UI components
 */
const webpack = require('webpack');

const pkgConfig = require('../../package.json').config;
const ringConfig = require('../../webpack.config');

exports.managerWebpack = function managerWebpack(config) {
  config.module.rules.forEach(rule => {
    rule.exclude = [
      /\.storybook/,
      ringConfig.componentsPath,
      /@primer\/octicons/,
      /@jetbrains\/logos/
    ].concat(rule.exclude || []);
  });

  ringConfig.loaders.cssLoader.include.push(/\.storybook/);

  ringConfig.config.module.rules.push({
    test: /\.svg$/,
    loader: require.resolve('svg-inline-loader'),
    options: {removeSVGTagAttrs: false},
    include: [/@primer\/octicons/, /@jetbrains\/logos/]
  });

  const serverUri = pkgConfig.hub;
  const clientId = pkgConfig.clientId;
  const hubConfig = JSON.stringify({serverUri, clientId});

  return {
    ...config,
    entry: [
      ...config.entry,
      require.resolve('./custom-header')
    ],
    module: {
      ...config.module,
      rules: [
        ...config.module.rules,
        ...ringConfig.config.module.rules
      ]
    },
    plugins: [
      ...config.plugins,
      new webpack.DefinePlugin({hubConfig})
    ],
    node: {
      Buffer: false,
      process: false
    }
  };
};
