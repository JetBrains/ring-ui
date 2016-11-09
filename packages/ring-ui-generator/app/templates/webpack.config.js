/* eslint-env node */
/* eslint-disable modules/no-cjs */

const path = require('path');
const webpack = require('webpack');
const webpackConfigMerger = require('webpack-config-merger');
const cssnext = require('postcss-cssnext');
const calc = require('postcss-calc');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const argv = require('minimist')(process.argv);

const pkgConfig = require('./package.json');
const isDevelop = argv.p === undefined;

const componentsPath = [path.join(__dirname, pkgConfig.config.components)];
const ringUiWebpackConfig = require('ring-ui');

// Patch ring-ui svg-sprite-loader config
ringUiWebpackConfig.svgSpriteLoader.include.push(require('jetbrains-logos'), require('jetbrains-icons'));

const webpackConfig = webpackConfigMerger(ringUiWebpackConfig,
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
      devtoolModuleFilenameTemplate: '/[absolute-resource-path]'
    },
    module: {
      loaders: [
        {
          test: /\.css$/,
          include: componentsPath,
          loaders: [
            'style',
            'css?modules&importLoaders=1&localIdentName=[name]__[local]__[hash:base64:7]',
            `postcss?pack=${pkgConfig.name}`
          ]
        },
        {
          test: /\.js$/,
          include: componentsPath,
          loader: 'babel'
        }
      ]
    },
    postcss: {
      [pkgConfig.name]: [
        cssnext,
        calc
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
        template: 'html?interpolate!src/index.html'
      }),
      new webpack.DefinePlugin({
        'process.env': {
          // This has effect on the react lib size
          NODE_ENV: !isDevelop ? '"production"' : '"development"'
        }
      }),
      new webpack.optimize.DedupePlugin()
    ]
  });

module.exports = webpackConfig;
