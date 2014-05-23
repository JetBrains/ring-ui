'use strict';

var gulp = require('gulp'),
  gutil = require('gulp-util'),
  clean = require('gulp-clean'),
  connect = require('gulp-connect'),
  autoprefixer = require('gulp-autoprefixer'),
  minifycss = require('gulp-minify-css'),
  scss = require('gulp-sass'),
  webpack = require('webpack');

var webpackConfig = require('./webpack.config.js');

var PATH = {
  tmp: 'tmp',
  dist: 'dist',
  bundles: {
    root: 'bundles/',
    js: 'bundles/**/*.js',
    css: 'bundles/**/*.scss'
  },
  js: {
    jsxSrc: 'blocks/**/*.jsx',
    src: [
      'blocks/**/*.js',
      'blocks/**/*.jsx'
    ]
  },
  styles: {
    src: 'blocks/**/*.scss',
    dev: 'bundles/ring-lib.scss'
  },
  fontsSrc: [
    'blocks/font-icon/**/*.woff',
    'blocks/font-icon/**/*.eot',
    'blocks/font-icon/**/*.ttf',
    'blocks/font-icon/**/*.svg'
  ],
  fontsDest: 'dist/fonts'
};

var PORT = 8000;

gulp.task('clean', function () {
  return gulp.src([
    PATH.tmp
  ], {
    read: false
  }).
    pipe(clean());
});

gulp.task('cleanDist', function () {
  return gulp.src([
    PATH.dist
  ], {
    read: false
  }).
    pipe(clean());
});

gulp.task('server', function () {
  connect.server({
    root: [
      '.',
      'dist'
    ],
    port: PORT,
    livereload: true
  });
});

gulp.task('watch', [
  'webpack',
  'styles-dev',
  'fonts'
], function () {
  gulp.watch(PATH.js.src, function (file) {
    gulp.start('webpack', function () {
      gulp.src(file.path).
        pipe(connect.reload());
    });
  });

  gulp.watch(PATH.styles.src, function (file) {
    gulp.start('webpack', function () {
      gulp.src(file.path).
        pipe(connect.reload());
    });
  });

  gulp.start('server');

});

gulp.task('fonts', function () {
  gulp.src(PATH.fontsSrc).
    pipe(gulp.dest(PATH.fontsDest));
});

gulp.task('styles-dev', function () {
  return gulp.src(PATH.styles.dev).
    pipe(scss({
      sourcemap: true,
      errLogToConsole: true
    })).
    pipe(gulp.dest(PATH.dist)).
    pipe(connect.reload());
});

gulp.task('styles', function () {
  return gulp.src(PATH.bundles.css).
    pipe(scss({
      sourcemap: true
    })).
    pipe(autoprefixer('last 2 versions', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4')).
    pipe(minifycss()).
    pipe(gulp.dest(PATH.dist));
});

gulp.task('webpack', function (cb) {
  if (gulp.env.production) {
    webpackConfig.plugins = webpackConfig.plugins.concat(new webpack.optimize.UglifyJsPlugin());
    webpackConfig.output.filename = 'main.js';
  }
  webpack(webpackConfig, function (err) {
    if (err) {
      throw new gutil.PluginError('execWebpack', err);
    }
    cb();
  });
});

gulp.task('default', [
  'cleanDist'
], function () {

  gulp.start('watch');
});