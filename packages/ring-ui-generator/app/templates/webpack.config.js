/* eslint-env node */
/* eslint-disable modules/no-cjs */

const path = require('path');
const webpack = require('webpack');
const webpackConfigMerger = require('webpack-config-merger');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const pkgConfig = require('./package.json');
const componentsPath = [path.join(__dirname, pkgConfig.config.components)];
const ringUiWebpackConfig = require('ring-ui');

// Patch ring-ui svg-sprite-loader config
ringUiWebpackConfig.loaders.svgSpriteLoader.include.push(require('jetbrains-logos'), require('jetbrains-icons'));

const webpackConfig = webpackConfigMerger(ringUiWebpackConfig.config,
  {
    entry: `${componentsPath}/app/app.js`,
    resolve: {
      alias: {
        react: path.resolve('./node_modules/react'),
        'react-dom': path.resolve('./node_modules/react-dom')
      }
    },
    output: {
      path: pkgConfig.dist,
      filename: '[name].js',
      publicPath: '/',
      devtoolModuleFilenameTemplate: '/[absolute-resource-path]'
    },
    module: {
      loaders: [
        {
          test: /\.css$/,
          include: componentsPath,
          loaders: [
            'style-loader',
            'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]__[hash:base64:7]',
            `postcss-loader`
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
