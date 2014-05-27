var path = require('path');

module.exports = {
  entry: './webpack.js',
  target: 'web',
  debug: false,
  devtool: false,
  watch: false,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'main.js',
    library:'Ring'
  },
  resolve: {
    modulesDirectories: [
      'node_modules'
    ]
  },
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loader: 'style!css!autoprefixer-loader?browsers=last 2 versions, safari 5, ie 8, ie 9, opera 12.1, ios 6, android 4!sass?outputStyle=expanded!'
      },
      {
        test: /\.js$/,
        loader: 'jsx'
      }
    ],
    noParse: /\.min\.js/
  },
  plugins: []
};