const webpack = require('webpack');

const ringConfig = require('../webpack.config');
const pkgConfig = require('../package.json').config;

module.exports = ({config}) => {
  ringConfig.loaders.cssLoader.include.push(/\.storybook/);
  ringConfig.loaders.svgInlineLoader.include.push(/octicons/);
  ringConfig.loaders.svgInlineLoader.include.push(/@jetbrains\/logos/);
  ringConfig.loaders.babelLoader.options.plugins = [[
    'babel-plugin-react-docgen',
    {
      DOC_GEN_COLLECTION_NAME: 'STORYBOOK_REACT_CLASSES'
    }
  ]];

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

  const serverUri = pkgConfig.hub;
  const clientId = pkgConfig.clientId;
  const hubConfig = JSON.stringify({serverUri, clientId});

  config.plugins.push(new webpack.DefinePlugin({hubConfig}));

  return config;
};
