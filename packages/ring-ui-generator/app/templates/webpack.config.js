/* eslint-env node */
/* eslint-disable modules/no-cjs */

const {join, resolve} = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const pkgConfig = require('./package.json').config;
const componentsPath = join(__dirname, pkgConfig.components);
const ringUiWebpackConfig = require('ring-ui');

// Patch ring-ui svg-sprite-loader config
ringUiWebpackConfig.loaders.svgSpriteLoader.include.push(require('jetbrains-logos'), require('jetbrains-icons'));

const webpackConfig = () => ({
  entry: `${componentsPath}/app/app.js`,
  resolve: {
    alias: {
      react: resolve('./node_modules/react'),
      'react-dom': resolve('./node_modules/react-dom')
    }
  },
  output: {
    path: resolve(__dirname, pkgConfig.dist),
    filename: '[name].js',
    publicPath: '/',
    devtoolModuleFilenameTemplate: '/[absolute-resource-path]'
  },
  module: {
    rules: [
      ...ringUiWebpackConfig.config.module.rules,
      {
        test: /\.css$/,
        include: componentsPath,
        loaders: [
          'style-loader',
          'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]__[hash:base64:7]',
          'postcss-loader'
        ]
      },
      {
        test: /\.js$/,
        include: componentsPath,
        loader: 'babel-loader'
      }
    ]
  },
  devServer: {
    stats: {
      assets: false,
      children: false,
      chunks: false,
      hash: false,
      version: false
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'html-loader?interpolate!src/index.html'
    })
  ]
});

module.exports = webpackConfig;
