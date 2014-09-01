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
var tar = require('gulp-tar');
var gzip = require('gulp-gzip');
var rename = require('gulp-rename');
var filter = require('gulp-filter');

var sprite = require('gulp-svg-sprites');
var svg2png = require('gulp-svg2png');
var clean = require('gulp-clean');
var svgmin = require('gulp-svgmin');
var concat = require('gulp-concat');

var CSSlint = require('csslint').CSSLint;

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

gulp.task('archive', ['clean', 'webpack:build'], function () {
  return gulp.src([
      pkgConfig.dist + '/ring.js',
      pkgConfig.src + '/**/*.{jsx,js,scss,png,svg,ttf,woff,eof}',
      '!' + pkgConfig.src + '/**/*.test.js',
      '!' + pkgConfig.src + '/ring.js',
      'package.json',
      'webpack.config.js'
  ])
    .pipe(rename(function (path) {
      path.dirname = 'package/' + path.dirname;
    }))
    .pipe(tar('ring-ui-component.tar'))
    .pipe(gzip())
    .pipe(gulp.dest(pkgConfig.dist));
});

gulp.task('lint-styles', function () {
  var reportFilename = 'css-lint.xml';
  var formatter = CSSlint.getFormatter('checkstyle-xml');
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
    }

    return through(function() {}, endStream);
  }

  return gulp.src(pkgConfig.src + '/components/**/*.scss')
    .pipe(csscomb()) // just detect errors for now
    .pipe(sass())
    .pipe(filter(function (file) {
      return file.isBuffer() ? !!file.contents.length : true;
     }))
    .pipe(csslint('.csslintrc'))
    .pipe(csslint.reporter(reporter))
    .pipe(exportReport())
    .pipe(gulp.dest(pkgConfig.dist))
    .on('end', function() {
      console.log('##teamcity[importData type=\'checkstyle\' path=\'' + pkgConfig.dist + '/' + reportFilename + '\']');
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
gulp.task('build', ['lint', 'lint-styles', 'test:build', 'webpack:build', 'archive']);

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