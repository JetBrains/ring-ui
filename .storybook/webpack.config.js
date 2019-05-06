const webpack = require('@storybook/core/node_modules/webpack');

const ringConfig = require('../webpack.config');
const pkgConfig = require('../package.json').config;

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

  config.entry.favicon = 'file-loader?name=favicon.ico!@jetbrains/logos/ring-ui/favicon.ico';

  const serverUri = pkgConfig.hub;
  const clientId = pkgConfig.clientId;
  const hubConfig = JSON.stringify({serverUri, clientId});

  config.plugins.push(new webpack.DefinePlugin({hubConfig}));

  return config;
};
