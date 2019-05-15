/**
 * Storybook preset that patches manager's webpack config to enable loading Ring UI components
 */

const ringConfig = require('../../webpack.config');

exports.managerWebpack = function managerWebpack(config) {
  ringConfig.loaders.cssLoader.include.push(/\.storybook/);
  ringConfig.loaders.svgInlineLoader.include.push(/octicons/);

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
    }
  };
};
