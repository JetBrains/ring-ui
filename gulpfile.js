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
var karma = require('gulp-karma');

var webpackConfig = {
  cache: true,
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

// The development server (the recommended option for development)
//gulp.task("default", ["webpack-dev-server"]);

// Build and watch cycle (another option for development)
// Advantage: No server required, can run app from filesystem
// Disadvantage: Requests are not blocked until bundle is available,
//               can serve an old app on refresh
gulp.task("build-dev", ["webpack:build-dev"], function () {
  gulp.watch(["app/**/*"], ["webpack:build-dev"]);
});

// Production build
//gulp.task("build", ["webpack:build"]);

gulp.task("webpack:build", function (callback) {
  // modify some webpack config options
  webpackConfig.plugins = webpackConfig.plugins.concat(
    new webpack.DefinePlugin({
      "process.env": {
        // This has effect on the react lib size
        "NODE_ENV": JSON.stringify("production")
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin()
  );

  // run webpack
  webpack(webpackConfig, function (err, stats) {
    if (err) throw new gutil.PluginError("webpack:build", err);
    gutil.log("[webpack:build]", stats.toString({
      colors: true
    }));
    callback();
  });
});

gulp.task("webpack:build-dev", function (callback) {
  // modify some webpack config options
  var myDevConfig = Object.create(webpackConfig);
  myDevConfig.devtool = "sourcemap";
  myDevConfig.debug = true;

  // create a single instance of the compiler to allow caching
  // run webpack
  webpack(myDevConfig).run(function (err, stats) {
    if (err) throw new gutil.PluginError("webpack:build-dev", err);
    gutil.log("[webpack:build-dev]", stats.toString({
      colors: true
    }));
    callback();
  });
});

gulp.task("webpack-dev-server", function (callback) {
  // modify some webpack config options
  var myConfig = Object.create(webpackConfig);
  myConfig.devtool = "eval";
  myConfig.debug = true;

  // Start a webpack-dev-server
  new WebpackDevServer(webpack(myConfig), {
    publicPath: "/" + myConfig.output.publicPath,
    stats: {
      colors: true
    }
  }).listen(8080, "localhost", function (err) {
      if (err) throw new gutil.PluginError("webpack-dev-server", err);
      gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
    });
});

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

gulp.task('test', function() {
  // Be sure to return the stream
  return gulp.src(['blocks/**/*.js','test/**/*.js'])
    .pipe(karma({
      configFile: 'test/karma.conf.js',
      action: 'run'
    }))
    .on('error', function(err) {
      // Make sure failed tests cause gulp to exit non-zero
      throw err;
    });
});

gulp.task('default', [
  'clean'
], function () {
  gulp.start('watch');
});
