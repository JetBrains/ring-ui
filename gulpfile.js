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

// Read configuration from package.json
var pkgConfig = Object.create(require('./package.json'));

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
      },
      // the url-loader uses DataUrls.
      // the file-loader emits files.
      { test: /\.woff$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
      { test: /\.ttf$/, loader: "file-loader" },
      { test: /\.eot$/, loader: "file-loader" },
      { test: /\.svg$/, loader: "file-loader" }
    ],
    noParse: /\.min\.js/
  },
  plugins: []
};

//The development server (the recommended option for development)
gulp.task("default", ["webpack-dev-server"]);

// Build and watch cycle (another option for development)
// Advantage: No server required, can run app from filesystem
// Disadvantage: Requests are not blocked until bundle is available,
//               can serve an old app on refresh
gulp.task("build-dev", ["webpack:build-dev"], function () {
  gulp.watch(["src/**/*"], ["webpack:build-dev"]);
});

// Production build
gulp.task("build", ["test", "webpack:build"]);

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

  //Out filename
  webpackConfig.output.filename = 'bundle.js';

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

gulp.task("webpack-dev-server", function () {
  // modify some webpack config options
  var myConfig = webpackConfig;
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