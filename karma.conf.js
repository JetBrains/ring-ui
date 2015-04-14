/* eslint-env node */
var path = require('path');

function generateConfig(karma) {
  var prepareWbpackConf = function (webpackConf) {
    webpackConf.devtool = 'eval';
    webpackConf.output = {};
    webpackConf.entry = {};
    webpackConf.cache = {};
    webpackConf.resolve.root = path.join(__dirname, 'test-helpers');

    return webpackConf;
  };

  var webdriverConfig = {
    hostname: '***REMOVED***',
    port: 4545
  };

  var buildVersion = process.env.npm_package_config_version || 'dev';
  var testName = 'Ring UI library Karma unit tests, build #' + buildVersion;

  var config = {

    // base path, that will be used to resolve files and exclude
    basePath: '',


    // frameworks to use
    frameworks: ['mocha', 'chai', 'chai-as-promised', 'chai-jquery', 'sinon-chai'],

    files: [
      'node_modules/jquery/dist/jquery.js',
      'test-helpers/phantomjs-shims.js',
      'test-helpers/mocha-globals.js',
      'test-helpers/test-suite.js'
    ],

    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress'],

    // list of preprocessors
    preprocessors: {
      'test-helpers/test-suite.js': ['webpack']
    },

    webpack: prepareWbpackConf(require('./webpack.config.js')),

    webpackServer: {
      stats: {
        colors: true
      },
      noInfo: true,
      quiet: true
    },

    // web server port
    port: 9876,

    // the port used by the webpack-dev-server
    // defaults to "config.port" + 1
    // webpackPort: 1234,

    // cli runner port
    runnerPort: 9100,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: karma.LOG_DISABLE || karma.LOG_ERROR || karma.LOG_WARN || karma.LOG_INFO || karma.LOG_DEBUG
    logLevel: karma.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS — only installed
    // - IE (only Windows)
    browsers: ['PhantomJS'],

    // Custom Chrome launcher for CI use
    customLaunchers: {
      ChromeNoSandbox: {
        base: 'Chrome',
        flags: ['--no-sandbox', '--test-type']
      },
      wdIE11: {
        base: 'WebDriver',
        config: webdriverConfig,
        'x-ua-compatible': 'IE=edge',
        testName: testName,
        browserName: 'internet explorer'
      },
      wdIE9: {
        base: 'WebDriver',
        config: webdriverConfig,
        'x-ua-compatible': 'IE=EmulateIE9',
        testName: testName,
        browserName: 'internet explorer'
      },
      wdFirefox: {
        base: 'WebDriver',
        config: webdriverConfig,
        testName: testName,
        browserName: 'firefox'
      },
      wdChrome: {
        base: 'WebDriver',
        config: webdriverConfig,
        testName: testName,
        browserName: 'chrome'
      }
    },

    hostname: require('os').hostname(),

    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,
    // Increase timeout because of webpack
    // See https://github.com/karma-runner/karma/issues/598
    browserNoActivityTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true
  };

  if (karma && typeof karma.set === 'function') {
    karma.set(config);
  }

  return config;
}

module.exports = generateConfig;
