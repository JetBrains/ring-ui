/* eslint-env node */
/* eslint-disable modules/no-cjs */

const path = require('path');
const webpack = require('webpack');
const webpackConfigMerger = require('webpack-config-merger');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const argv = require('minimist')(process.argv);

const pkgConfig = require('./package.json');
const isDevelop = argv.d !== undefined;
const serverBase = isDevelop ? 'http://localhost:8080/api' : 'api';

const srcPath = [path.join(__dirname, 'src')];

const webpackConfig = webpackConfigMerger(require('ring-ui/webpack.config'),
  {
    entry: `${pkgConfig.config.src}/components/app/app.js`,
    resolve: {
      alias: {
        react: path.resolve('./node_modules/react'),
        'react-dom': path.resolve('./node_modules/react-dom')
      }
    },
    output: {
      path: './dist',
      filename: '[name].js'
    },
    module: {
      loaders: [
        {
          test: /\.scss$/,
          include: srcPath,
          loaders: [
            'style',
            'css',
            'postcss?pack=<%= camelCaseName %>',
            'sass?outputStyle=expanded'
          ]
        },
        {
          test: /\.js$/,
          include: srcPath,
          loader: 'babel'
        }
      ]
    },
    postcss: {
      '<%= camelCaseName %>': [autoprefixer]
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
      // new webpack.optimize.DedupePlugin()
    ]
  });

module.exports = webpackConfig;
