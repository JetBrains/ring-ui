'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var webpack = require('webpack');
var rimraf = require('gulp-rimraf');
var WebpackDevServer = require('webpack-dev-server');
var karma = require('gulp-karma');
var nodemon = require('gulp-nodemon');
var csscomb = require('gulp-csscomb');
var csslint = require('gulp-csslint');
var sass = require('gulp-sass');

var CSSlint = require( 'csslint' ).CSSLint;

var path = require('path');
var Buffer = require('buffer').Buffer;
var through = require('through');

// Read configuration from package.json
var pkgConfig = Object.create(require('./package.json'));

//Read common webpack config from  file
var webpackConfig = Object.create(require('./webpack.config.js'));

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
    new webpack.optimize.UglifyJsPlugin()
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

  var serverPort = gulp.env.port || '8080';

  // Start a webpack-dev-server
  new WebpackDevServer(webpack(myConfig), {
    contentBase: pkgConfig.src,
    stats: {
      colors: true
    }
  }).listen(serverPort, 'localhost', function (err) {
      if (err) {
        throw new gutil.PluginError('webpack-dev-server', err);
      }
      gutil.log('[webpack-dev-server]', 'http://localhost:' + serverPort + '/webpack-dev-server/index.html');
    });
});

gulp.task('dev-server', function () {
  nodemon({
    exec: ['webpack-dev-server', '--port=' + (gulp.env.port || '')],
    watch: [
      'webpack.config.js',
      'gulpfile.js'
    ],
    ext: 'js'
  });
});

gulp.task('lint', function () {
  return gulp.src([pkgConfig.src + '/components/**/*.{js,jsx}', '*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    // Reports xml to console :(
    // .pipe(jshint.reporter('jslint_xml'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('test', function () {
  // Be sure to return the stream
  return gulp.src([
    './node_modules/jquery/dist/jquery.js',
    './test-helpers/*.js',
    pkgConfig.src + '/components/**/*.test.js'
  ])
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run'
    }))
    .on('error', function (err) {
      // Make sure failed tests cause gulp to exit non-zero
      throw err;
    });
});

gulp.task('test:build', function () {
  // Be sure to return the stream
  return gulp.src([
    './node_modules/jquery/dist/jquery.js',
    './test-helpers/*.js',
    pkgConfig.src + '/components/**/*.test.js'
  ])
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run',
      browsers: ['ChromeNoSandbox', 'Firefox'],
      reporters: 'teamcity'
    }))
    .on('error', function (err) {
      // Make sure failed tests cause gulp to exit non-zero
      throw err;
    });
});

gulp.task('copy', ['clean'], function () {
  return gulp.src([
      pkgConfig.src + '/**/*.{jsx,js,scss,png,svg,ttf,woff,eof}',
      '!' + pkgConfig.src + '/**/*.test.js',
      'package.json',
      'webpack.config.js'
  ]).pipe(gulp.dest(pkgConfig.distPackage));
});

gulp.task('lint-styles', function () {
  var reportFilename = 'css-lint.xml';
  var formatter = CSSlint.getFormatter('lint-xml');
  var report = formatter.startFormat();

  function reporter(file) {
    var filename = path.relative(__dirname, file.csslint.results[0].file);
    var messages = file.csslint.results.map(function(file) {
      return file.error;
    });

    report += formatter.formatResults({messages: messages}, filename, {});
  }

  function exportReport() {
    function endStream() {
      report += formatter.endFormat();

      var file = new gutil.File({
        path: reportFilename,
        contents: new Buffer(report)
      });

      /* jshint -W040 */
      this.emit('data', file);
      this.emit('end');
      /* jshint +W040 */

      console.log('##teamcity[importData type=\'jslint\' path=\'' + pkgConfig.dist + '/' + reportFilename + '\']');
    }

    return through(function() {}, endStream);
  }

  return gulp.src(pkgConfig.src + '/components/**/*.scss')
    .pipe(csscomb()) // just detect errors for now
    .pipe(sass())
    .pipe(csslint('.csslintrc'))
    .pipe(csslint.reporter(reporter))
    .pipe(exportReport())
    .pipe(gulp.dest(pkgConfig.dist));
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
gulp.task('build', ['lint', 'lint-styles', 'test:build', 'webpack:build', 'copy']);
