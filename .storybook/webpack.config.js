const webpack = require('@storybook/core/node_modules/webpack');

const ringConfig = require('../webpack.config');
const pkgConfig = require('../packages/docs/package.json').config;

const colorInfo = msg => `\u001b[1m\u001b[34m${msg}\u001b[39m\u001b[22m`;

// TODO: support ENV variables
const getParam = name => pkgConfig[name];

module.exports = ({config}) => {
  ringConfig.loaders.cssLoader.include.push(/\.storybook/);
  ringConfig.loaders.svgInlineLoader.include.push(/@jetbrains\/logos/);

  config.module.rules = [
    ...ringConfig.config.module.rules,
    {
      test: /\.md$/,
      loader: 'raw-loader'
    },
    {
      test: /\.examples\.js$/,
      loaders: [require.resolve('@storybook/addon-storysource/loader')],
      enforce: 'pre'
    }
  ];

  const serverUri = getParam('hub');
  const clientId = getParam('clientId');

  // eslint-disable-next-line no-console
  console.log(`Hub server used is ${colorInfo(serverUri)}`);
  const hubConfig = JSON.stringify({serverUri, clientId});

  config.plugins.push(new webpack.DefinePlugin({hubConfig}));

  return config;
};
