'use strict';

var gulp = require('gulp'),
  clean = require('gulp-clean'),
  connect = require('gulp-connect'),
  autoprefixer = require('gulp-autoprefixer'),
  minifycss = require('gulp-minify-css'),
  scss = require('gulp-sass');

var PATH = {
  tmp: 'tmp',
  dist: 'dist',
  bundles: {
    js: 'bundles/**/*.js',
    css: 'bundles/**/*.scss'
  },
  styles: 'blocks/**/*.scss',
  stylesDev: 'bundles/ring-lib.scss',
  fontsSrc: [
    'blocks/font-icon/**/*.woff',
    'blocks/font-icon/**/*.eot',
    'blocks/font-icon/**/*.ttf',
    'blocks/font-icon/**/*.svg'
  ],
  fontsDest: 'dist/fonts'
};

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
    port: 8000,
    livereload: true
  });
});

gulp.task('watch', [
  'styles-dev',
  'fonts'
], function () {
  gulp.watch(PATH.styles, ['styles-dev']);

  gulp.start('server');

});

gulp.task('fonts', function () {
  gulp.src(PATH.fontsSrc).
    pipe(gulp.dest(PATH.fontsDest));
});

gulp.task('styles-dev', function () {
  return gulp.src(PATH.stylesDev).
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
    pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4')).
    pipe(minifycss()).
    pipe(gulp.dest(PATH.dist));
});


gulp.task('default', [
  'clean'
], function () {
  gulp.start('watch');
});