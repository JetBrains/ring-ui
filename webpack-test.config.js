const path = require('path');

const webpack = require('webpack');

const {config, componentsPath} = require('./webpack.config');
const loaders = require('./webpack.config').loaders;

componentsPath.push(path.join(__dirname, 'src'));

const helpersPath = path.join(__dirname, 'test-helpers');

loaders.babelLoader.include.push(helpersPath);
loaders.babelLoader.sideEffects = true;

config.mode = 'development';

config.output = {
  devtoolModuleFilenameTemplate: '/[absolute-resource-path]' // For some reason slash in the beginning is required
};

config.devtool = 'source-map';

config.plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: '"development"'
    }
  })
];

// this addresses internal `require`s in enzyme used for environment detection
config.externals = {
  'react/addons': 'react',
  'react/lib/ExecutionEnvironment': 'react',
  'react/lib/ReactContext': 'react',
  'react-addons-test-utils': 'window'
};

module.exports = config;

