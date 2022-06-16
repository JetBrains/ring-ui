process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = config => ({
  // base path that will be used to resolve files and excludes
  basePath: '',

  // frameworks to use
  frameworks: ['mocha', 'webpack'],

  files: [
    'test-helpers/test-suite.js'
  ],

  // test results reporter to use
  // possible values: 'dots', 'progress', 'junit', 'growl'
  reporters: ['progress'],

  // list of preprocessors
  preprocessors: {
    'test-helpers/test-suite.js': ['webpack', 'sourcemap']
  },

  webpack: require('./webpack-test.config'),

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
  // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
  logLevel: config.LOG_INFO,

  // enable / disable watching file and executing tests whenever any file changes
  autoWatch: true,

  // Start these browsers
  browsers: ['ChromeHeadless'],

  customLaunchers: {
    ChromeHeadlessNoSandbox: {
      base: 'ChromeHeadless',
      flags: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    }
  },

  // If browser does not capture in given timeout [ms], kill it
  captureTimeout: 60000,
  // Increase timeout because of webpack
  // See https://github.com/karma-runner/karma/issues/598
  browserNoActivityTimeout: 60000,

  // CI mode
  // if true, it will capture the browser, run the tests, and exit
  singleRun: true
});
