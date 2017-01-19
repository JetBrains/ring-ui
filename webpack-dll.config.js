/* eslint-disable modules/no-cjs */

const webpack = require('webpack');

module.exports = {
  entry: {
    dll: ['./site/dll']
  },
  output: {
    filename: '[name].js',
    path: 'dist/',
    library: 'dll'
  },
  plugins: [
    new webpack.DllPlugin({
      name: 'dll',
      path: 'dist/dll-manifest.json'
    })
  ]
};
