var path = require('path');

module.exports = {
  // This is the main file that should include all other JS files
  entry: './webpack.js',
  target: 'web',
  debug: false,
  // We are watching in the gulp.watch, so tell webpack not to watch
  watch: false,
//  watchDelay: 300,
  output: {
    path: path.join(__dirname, 'dist'),
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
        test: /\.scss$/,
        loader: 'style!css!autoprefixer-loader?browsers=last 2 version, Firefox 15!sass?outputStyle=expanded!'
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
//    new webpack.optimize.UglifyJsPlugin()
  ]
};