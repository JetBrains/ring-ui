/**
 * Storybook preset that patches manager's webpack config to enable loading Ring UI components
 */
const webpack = require('webpack');

const pkgConfig = require('../../package.json').config;
const ringConfig = require('../../webpack.config').createConfig();

exports.managerWebpack = function managerWebpack(config) {
  ringConfig.componentsPath.push(/\.storybook/);
  config.module.rules.forEach(rule => {
    rule.exclude = ringConfig.componentsPath.concat(rule.exclude || []);
  });
  // eslint-disable-next-line no-magic-numbers
  ringConfig.loaders.cssLoader.use[2].loader =
    require.resolve('postcss-loader');

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
        ...ringConfig.config.module.rules,
        {
          test: /\.svg$/,
          loader: require.resolve('svg-inline-loader'),
          options: {removeSVGTagAttrs: false},
          include: [/@primer\/octicons/, /@jetbrains\/logos/]
        }
      ]
    },
    plugins: [
      ...config.plugins,
      new webpack.DefinePlugin({hubConfig})
    ]
  };
};
