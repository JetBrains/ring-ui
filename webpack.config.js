var path = require('path');
//var webpack = require("webpack");

module.exports = {
  // This is the main file that should include all other JS files
  entry: './webpack.js',
  target: 'web',
  debug: false,
  // We are watching in the gulp.watch, so tell webpack not to watch
  watch: false,
//  watchDelay: 300,
  output: {
    path: path.join(__dirname, 'dist', 'blocks'),
    // If you want to generate a filename with a hash of the content (for cache-busting)
    // filename: "main-[hash].js",
    filename: 'main.js'
  },
  resolve: {
    // Tell webpack to look for required files in bower and node
    modulesDirectories: [
      'node_modules'
    ]
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        exclude: /\.useable\.css$/,
        loader: 'style!css'
      },
      {
        test: /\.useable\.css$/,
        loader: 'style/useable!css'
      },
      {
        test: /\.scss$/,
        loader: 'style!css!sass?outputStyle=expanded'
      },
      {
        test: /\.js$/,
        loader: 'jsx'
      }
    ],
    noParse: /\.min\.js/
  },
  plugins: [
    // If you want to minify everything
    // new webpack.optimize.UglifyJsPlugin()
  ]
};