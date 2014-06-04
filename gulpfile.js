'use strict';

var gulp = require('gulp'),
  gutil = require('gulp-util'),
  clean = require('gulp-clean'),
  connect = require('gulp-connect'),
  autoprefixer = require('gulp-autoprefixer'),
  minifycss = require('gulp-minify-css'),
  scss = require('gulp-sass'),
  webpack = require('webpack'),
  spawn = require('child_process').spawn,
  path = require('path');

gulp.task('clean', function () {
  return gulp.src([
    'dist'
  ], {
    read: false
  }).
    pipe(clean());
});

gulp.task('server', function () {
  connect.server({
    root: [
      '.',
      'site',
      'dist'
    ],
    port: 8000,
    livereload: true
  });
  gutil.
    log('Server launched').
    beep();
});

gulp.task('watch', [
  'webpack',
  'fonts'
], function () {
  gulp.watch([
    'blocks/**/*.jsx',
    'blocks/**/*.js',
    'blocks/**/*.scss'
  ], function (file) {
    gulp.start('webpack', function () {
      gulp.src(file.path).
        pipe(connect.reload());
    });
  });

  gulp.start('server');
});

gulp.task('fonts', function () {
  gulp.src([
    'blocks/font-icon/**/*.woff',
    'blocks/font-icon/**/*.eot',
    'blocks/font-icon/**/*.ttf',
    'blocks/font-icon/**/*.svg'
  ]).
    pipe(gulp.dest('dist/fonts'));
});

gulp.task('styles', function () {
  return gulp.src('bundles/**/*.scss').
    pipe(scss({
      sourcemap: true
    })).
    pipe(autoprefixer('last 2 versions', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4')).
    pipe(minifycss()).
    pipe(gulp.dest('dist'));
});

var webpackConfig = {
  entry: './site/webpack.js',
  target: 'web',
  debug: false,
  devtool: false,
  watch: false,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    library: 'Ring'
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

gulp.task('webpack', function (cb) {
  webpack(webpackConfig, function (err) {
    if (err) {
      throw new gutil.PluginError('execWebpack', err);
    }
    cb();
  });
});

gulp.task('build', function () {
  gulp.start('clean', 'fonts', 'test');
  webpackConfig.plugins = webpackConfig.plugins.concat(new webpack.optimize.UglifyJsPlugin());
  webpackConfig.output.filename = 'bundle.js';
  gulp.start('webpack');
});

gulp.task('test', function () {
  gulp.src('blocks/**/*.test.js').
    pipe(gulp.dest('tmp/__tests__'));
  spawn('npm', [
    'test'
  ], {
    stdio: 'inherit'
  });
});

gulp.task('default', [
  'clean'
], function () {
  gulp.start('watch');
});