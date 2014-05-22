'use strict';

var gulp = require('gulp'),
  clean = require('gulp-clean'),
  connect = require('gulp-connect'),
  autoprefixer = require('gulp-autoprefixer'),
  minifycss = require('gulp-minify-css'),
  scss = require('gulp-ruby-sass');

var PATH = {
  tmp: 'tmp',
  dist: 'dist',
  styles: 'blocks/**/*.scss',
  stylesDev: 'bundles/ring-lib.scss'
};

gulp.task('clean', function () {
  return gulp.src([
    PATH.tmp
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
  'styles'
], function () {

  gulp.watch(PATH.styles, ['styles-dev']);

  gulp.start('server');

});

gulp.task('styles-dev', function () {
  return gulp.src(PATH.stylesDev).
    pipe(scss({
      sourcemap: true,
      style: 'expanded'
    })).
    pipe(gulp.dest(PATH.dist)).
    pipe(connect.reload());
});

gulp.task('styles', function () {
  return gulp.src(PATH.styles).
    pipe(scss({
      sourcemap: true,
      style: 'expanded'
    })).
    pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4')).
    pipe(minifycss()).
    pipe(gulp.dest(PATH.dist)).
    pipe(connect.reload());
});


gulp.task('default', [
  'clean'
], function () {
  gulp.start('watch');
});