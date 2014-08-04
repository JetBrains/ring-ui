'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var webpack = require('webpack');
var rimraf = require('gulp-rimraf');
var WebpackDevServer = require('webpack-dev-server');
var karma = require('gulp-karma');
var nodemon = require('gulp-nodemon');
var sprite = require('gulp-svg-sprites');
var filter = require('gulp-filter');
var svg2png = require('gulp-svg2png');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
var svgmin = require('gulp-svgmin');
var concat = require('gulp-concat');

// Read configuration from package.json
var pkgConfig = Object.create(require('./package.json'));

//Read common webpack config from  file
var webpackConfig = Object.create(require('./webpack.conf.js'));

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

gulp.task('webpack:build-dev', ['clean'], function (callback) {
  // modify some webpack config options
  var myDevConfig = webpackConfig;
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
      if (err) throw new gutil.PluginError('webpack-dev-server', err);
      gutil.log('[webpack-dev-server]', 'http://localhost:' + serverPort + '/webpack-dev-server/index.html');
    });
});

gulp.task('dev-server', function () {
  nodemon({
    exec: ['webpack-dev-server', '--port=' + (gulp.env.port || '')],
    watch: [
      'webpack.conf.js',
      'gulpfile.js'
    ],
    ext: 'js'
  });
});

gulp.task('lint', function () {
  return gulp.src(pkgConfig.src + '/components/**/*.{js,jsx}')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('test', function () {
  // Be sure to return the stream
  return gulp.src(['./node_modules/jquery/dist/jquery.js', './node_modules/jso/jso.js', './test-helpers/*.js' , pkgConfig.src + '/components/**/*.test.js'])
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
  return gulp.src(['./node_modules/jquery/dist/jquery.js', './node_modules/jso/jso.js', './test-helpers/*.js' , pkgConfig.src + '/components/**/*.test.js'])
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
      'webpack.conf.js'
  ]).pipe(gulp.dest(pkgConfig.dist));
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
gulp.task('build', ['lint', 'test:build', 'webpack:build', 'copy']);

//Generate icon sprite
gulp.task('sprite', ['sprite:rename', 'sprite:create', 'sprite:concat', 'sprite:svg2png', 'sprite:svgmin', 'sprite:clean']);

var spriteName = 'icon';
var spriteCfg = {
  dest: 'src/components/icon',
  options: {
    common: 'ring-' + spriteName,
    selector: spriteName + '_%f',
    layout: 'vertical',
    cssFile: spriteName + '.scss',
    svgPath: '%f',
    pngPath: '%f',
    refSize: 64,
    svg: {
      sprite: spriteName + '.svg'
    }/*,
    preview: {
      sprite: spriteName + '.html'
    }*/
  }
};

gulp.task('sprite:rename', function () {
  //filename uses as a selector name, that's why a tmp source is created
  return gulp.src(spriteCfg.dest + '/source/**/*.svg', { base: process.cwd() })
    .pipe(rename(function (path) {
      path.basename = 'ring-icon_' + path.basename;
    }))
    .pipe(gulp.dest(spriteCfg.dest));
});

gulp.task('sprite:create', ['sprite:rename'], function () {
  return gulp.src(spriteCfg.dest + '/src/**/*.svg')
    .pipe(sprite(spriteCfg.options))
    .pipe(gulp.dest(spriteCfg.dest))
    .pipe(filter(spriteCfg.dest + '/source/*.svg'));
});

gulp.task('sprite:concat', ['sprite:create'], function () {
  return gulp.src([spriteCfg.dest + '/*.scss'])
    .pipe(concat(spriteName + '.scss'))
    .pipe(gulp.dest(spriteCfg.dest));
});

gulp.task('sprite:svg2png', ['sprite:create'], function () {
  return gulp.src([spriteCfg.dest + '/' + spriteName + '.svg'])
    .pipe(svg2png())
    .pipe(gulp.dest(spriteCfg.dest));
});

gulp.task('sprite:svgmin', ['sprite:create'], function () {
  return gulp.src(spriteCfg.dest + '/' + spriteName + '.svg')
  .pipe(svgmin())
    .pipe(gulp.dest(spriteCfg.dest));
});

gulp.task('sprite:clean', ['sprite:svg2png'], function () {
  return gulp.src([spriteCfg.dest + '/src'], {read: false})
    .pipe(clean());
});
