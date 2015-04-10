/* eslint-env node */
var gulp = require('gulp');
var gutil = require('gulp-util');
var webpack = require('webpack');
var rimraf = require('gulp-rimraf');
var WebpackDevServer = require('webpack-dev-server');
var AnyBarWebpackPlugin = require('anybar-webpack');
var nodemon = require('gulp-nodemon');
var argv = require('yargs').argv;

// Read configuration from package.json
var pkgConfig = Object.create(require('./package.json')).config;

//Read common webpack config from  file
var webpackConfig = Object.create(require('./webpack.config'));

gulp.task('clean', function () {
  return gulp.src(pkgConfig.dist, {read: false})
    .pipe(rimraf());
});

gulp.task('webpack:build', ['clean'], function (callback) {
  // modify some webpack config options
  webpackConfig.plugins = webpackConfig.plugins.concat(
    new webpack.DefinePlugin({
      'process.env': {
        // This has effect on the react lib size
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      output: {
        'ascii_only': true
      }
    })
  );

  // run webpack
  webpack(webpackConfig, function (err, stats) {
    if (err) {
      throw new gutil.PluginError('webpack:build', err);
    }
    gutil.log('[webpack:build]', stats.toString({
      colors: true
    }));
    callback();
  });
});

gulp.task('webpack:build-dev', ['clean'], function (callback) {
  // modify some webpack config options
  var myDevConfig = webpackConfig;
  myDevConfig.devtool = 'sourcemap';
  myDevConfig.debug = true;

  // create a single instance of the compiler to allow caching
  // run webpack
  webpack(myDevConfig).run(function (err, stats) {
    if (err) {
      throw new gutil.PluginError('webpack:build-dev', err);
    }
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
  myConfig.output.path = '/';
  myConfig.entry.jQuery = './node_modules/jquery/dist/jquery.js';
  myConfig.entry.utils = ['webpack-dev-server/client?http://localhost:8080', 'es5-shim', 'es5-shim/es5-sham.js'];
  myConfig.plugins = [new AnyBarWebpackPlugin()];

  var serverPort = argv.port || '8080';

  // Start a webpack-dev-server
  new WebpackDevServer(webpack(myConfig), {
    contentBase: pkgConfig.src,
    stats: {
      colors: true
    }
  }).listen(serverPort, function (err) {
      if (err) {
        throw new gutil.PluginError('webpack-dev-server', err);
      }
      gutil.log('[webpack-dev-server]', 'http://localhost:' + serverPort);
    });
});

gulp.task('dev-server', function () {
  nodemon({
    exec: ['webpack-dev-server', '--port=' + (argv.port || '')],
    watch: [
      'webpack.config.js',
      'gulpfile.js'
    ],
    ext: 'js'
  });
});

//The development server (the recommended option for development)
gulp.task('default', ['dev-server']);

// Build and watch cycle (another option for development)
// Advantage: No server required, can run app from filesystem
// Disadvantage: Requests are not blocked until bundle is available,
//               can serve an old app on refresh
gulp.task('build-dev', ['webpack:build-dev'], function () {
  gulp.watch([pkgConfig.src + '/**/*'], ['webpack:build-dev']);
});

// Production build
gulp.task('build', ['webpack:build']);
