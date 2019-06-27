/**
 * Storybook preset that patches manager's webpack config to enable loading Ring UI components
 */
const webpack = require('webpack');

const pkgConfig = require('../../package.json').config;
const ringConfig = require('../../webpack.config');

exports.managerWebpack = function managerWebpack(config) {
  ringConfig.loaders.cssLoader.include.push(/\.storybook/);
  ringConfig.loaders.svgInlineLoader.include.push(/octicons/);
  ringConfig.loaders.svgInlineLoader.include.push(/@jetbrains\/logos/);

  const serverUri = pkgConfig.hub;
  const clientId = pkgConfig.clientId;
  const hubConfig = JSON.stringify({serverUri, clientId});

  /**
   * Remove own Storybook css loaders due to double-applying
   * https://github.com/storybookjs/storybook/issues/6319#issuecomment-477852640
   */
  config.module.rules = config.module.rules.filter(
    f => f.test.toString() !== '/\\.css$/'
  );

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
    ]
  };
};
