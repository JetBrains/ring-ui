/* eslint-env node */
/* eslint-disable modules/no-cjs */

module.exports = config => {
  const webdriverConfig = {
    hostname: '***REMOVED***',
    port: 4545
  };

  const buildVersion = process.env.npm_package_config_version || 'dev';
  const testName = `Ring UI library Karma unit tests, build #${buildVersion}`;

  return {

    // base path, that will be used to resolve files and exclude
    basePath: '',


    // frameworks to use
    frameworks: ['mocha', 'chai', 'chai-as-promised', 'chai-dom', 'sinon-chai'],

    files: [
      'test-helpers/mocha-globals.js',
      'test-helpers/test-suite.js'
    ],

    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
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

    coverageReporter: {
      reporters: [
        {type: 'html', dir: 'coverage/'},
        {type: 'text-summary'}
      ]
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
    browsers: ['Electron'],

    electronOpts: {
      show: false,
      skipTaskbar: true,
      height: 1024,
      width: 768,
      webPreferences: {
        pageVisibility: true
      }
    },

    customLaunchers: {
      // Custom Chrome launcher for CI use
      ChromeNoSandbox: {
        base: 'Chrome',
        flags: ['--no-sandbox', '--test-type']
      },
      wdEdge: {
        base: 'WebDriver',
        config: webdriverConfig,
        testName,
        browserName: 'MicrosoftEdge'
      },
      wdIE11: {
        base: 'WebDriver',
        config: webdriverConfig,
        'x-ua-compatible': 'IE=edge',
        testName,
        browserName: 'internet explorer'
      },
      wdIE10: {
        base: 'WebDriver',
        config: webdriverConfig,
        'x-ua-compatible': 'IE=EmulateIE10',
        testName,
        browserName: 'internet explorer'
      },
      wdIE9: {
        base: 'WebDriver',
        config: webdriverConfig,
        'x-ua-compatible': 'IE=edge',
        testName,
        browserName: 'internet explorer'
      },
      wdFirefox: {
        base: 'WebDriver',
        config: webdriverConfig,
        testName,
        browserName: 'firefox'
      },
      wdChrome: {
        base: 'WebDriver',
        config: webdriverConfig,
        testName,
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
};
