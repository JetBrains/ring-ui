const {join, resolve} = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ringUiWebpackConfig = require('@jetbrains/ring-ui/webpack.config');

const pkgConfig = require('./package.json').config;

const componentsPath = join(__dirname, pkgConfig.components);

const webpackConfig = () => ({
  entry: `${componentsPath}/app/app.js`,
  resolve: {
    mainFields: ['module', 'browser', 'main'],
    alias: {
      react: resolve('./node_modules/react'),
      'react-dom': resolve('./node_modules/react-dom'),
      '@jetbrains/ring-ui': resolve('./node_modules/@jetbrains/ring-ui')
    }
  },
  output: {
    path: resolve(__dirname, pkgConfig.dist),
    filename: '[name].js',
    publicPath: '',
    devtoolModuleFilenameTemplate: '/[absolute-resource-path]'
  },
  module: {
    rules: [
      ...ringUiWebpackConfig.config.module.rules,
      {
        test: /\.svg$/,
        loader: require.resolve('svg-inline-loader'),
        options: {removeSVGTagAttrs: false},
        include: [require('@jetbrains/logos')]
      },
      {
        test: /\.css$/,
        include: componentsPath,
        use: [
          'style-loader',
          {loader: 'css-loader', options: {modules: true}},
          {loader: 'postcss-loader'}
        ]
      },
      {
        // Loaders for any other external packages styles
        test: /\.css$/,
        include: /node_modules/,
        exclude: ringUiWebpackConfig.componentsPath,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.js$/,
        include: [componentsPath],
        loader: 'babel-loader',
        options: {
          cacheDirectory: true
        }
      }
    ]
  },
  devServer: {<%- additionalDevServerOptions %>
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    })<%- additionalWebpackPlugins %>
  ]
});

module.exports = webpackConfig;
