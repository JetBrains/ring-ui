const ringConfig = require('../webpack.config');

module.exports = async ({config}) => {
  // TODO: Use more robust way instead of indexes
  const cssRule = config.module.rules.filter(m => m.test.toString().includes('css$'))[0];
  const svgRule = config.module.rules.filter(m => m.test.toString().includes('svg'))[0];

  // Keep embedded StoryBook CSS loader away from our files
  cssRule.exclude = [
    ...ringConfig.componentsPath
  ];
  // Keep embedded StoryBook SVG loader away from our SVGs
  svgRule.exclude = [
    /@jetbrains\/icons/
  ];

  config.module.rules = [
    ...config.module.rules,
    ...ringConfig.config.module.rules,
    {
      test: /\.examples\.js$/,
      loaders: [require.resolve('@storybook/addon-storysource/loader')],
      enforce: 'pre',
    }
  ];

  return config;
};
