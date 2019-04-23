const webpack = require('@storybook/core/node_modules/webpack');
const ringConfig = require('../webpack.config');
const pkgConfig = require('../packages/docs/package.json').config;

const colorInfo = msg => `\u001b[1m\u001b[34m${msg}\u001b[39m\u001b[22m`;

// TODO: support ENV variables
const getParam = name => pkgConfig[name];

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

  const serverUri = getParam('hub');
  const clientId = getParam('clientId');

  console.log(`Hub server used is ${colorInfo(serverUri)}`);
  const hubConfig = JSON.stringify({serverUri, clientId});

  config.plugins.push(new webpack.DefinePlugin({hubConfig}));

  return config;
};
