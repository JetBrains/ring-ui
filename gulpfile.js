'use strict';

var gulp = require('gulp'),
  gutil = require('gulp-util'),
  webpack = require('webpack'),
  path = require('path');
var WebpackDevServer = require('webpack-dev-server');
var karma = require('gulp-karma');

// Read configuration from package.json
var pkgConfig = Object.create(require('./package.json'));

var webpackConfig = Object.create(require('./webpack.conf.js'));

webpackConfig.entry = path.join(__dirname, pkgConfig.src, 'blocks/hello-world/hello-world.jsx');
webpackConfig.output = {
  path: path.join(__dirname, pkgConfig.dist),
  filename: 'bundle.js',
  library: 'Ring'
};

//The development server (the recommended option for development)
gulp.task('default', ['webpack-dev-server']);

// Build and watch cycle (another option for development)
// Advantage: No server required, can run app from filesystem
// Disadvantage: Requests are not blocked until bundle is available,
//               can serve an old app on refresh
gulp.task('build-dev', ['webpack:build-dev'], function () {
  gulp.watch([pkgConfig.src + '/**/*'], ['webpack:build-dev']);
});

// Production build
gulp.task('build', ['test', 'webpack:build']);

gulp.task('webpack:build', function (callback) {
  // modify some webpack config options
  webpackConfig.plugins = webpackConfig.plugins.concat(
    new webpack.DefinePlugin({
      'process.env': {
        // This has effect on the react lib size
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin()
  );

  //Out filename
  webpackConfig.output.filename = 'bundle.js';

  // run webpack
  webpack(webpackConfig, function (err, stats) {
    if (err) throw new gutil.PluginError('webpack:build', err);
    gutil.log('[webpack:build]', stats.toString({
      colors: true
    }));
    callback();
  });
});

gulp.task('webpack:build-dev', function (callback) {
  // modify some webpack config options
  var myDevConfig = Object.create(webpackConfig);
  myDevConfig.devtool = 'sourcemap';
  myDevConfig.debug = true;

  // create a single instance of the compiler to allow caching
  // run webpack
  webpack(myDevConfig).run(function (err, stats) {
    if (err) throw new gutil.PluginError('webpack:build-dev', err);
    gutil.log('[webpack:build-dev]', stats.toString({
      colors: true
    }));
    callback();
  });
});

gulp.task('webpack-dev-server', function () {
  // modify some webpack config options
  var myConfig = webpackConfig;
  myConfig.devtool = 'eval';
  myConfig.debug = true;

  // Start a webpack-dev-server
  var publicPath = '/' + myConfig.output.path;
  gutil.log('[webpack-dev-server]', 'public path: ' + publicPath);
  new WebpackDevServer(webpack(myConfig), {
    contentBase: pkgConfig.src,
//    publicPath: publicPath,
    stats: {
      colors: true
    }
  }).listen(8080, 'localhost', function (err) {
      if (err) throw new gutil.PluginError('webpack-dev-server', err);
      gutil.log('[webpack-dev-server]', 'http://localhost:8080/webpack-dev-server/index.html');
    });
});

gulp.task('test', function () {
  // Be sure to return the stream
  return gulp.src(['test/**/*.js'])
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run'
    }))
    .on('error', function (err) {
      // Make sure failed tests cause gulp to exit non-zero
      throw err;
    });
});