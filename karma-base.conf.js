const url = require('url');

module.exports = config => {
  const gridURL = process.env.SELENIUM_GRID;

  const buildVersion = process.env.npm_package_config_version || 'dev';
  const testName = `Ring UI library Karma unit tests, build #${buildVersion}`;

  const conf = {

    // base path that will be used to resolve files and excludes
    basePath: '',

    // frameworks to use
    frameworks: ['mocha'],

    files: [
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
        pageVisibility: true,
        sandbox: false
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
  };

  if (gridURL) {
    const {hostname, port, auth = ':'} = url.parse(gridURL);
    const [user, pwd] = auth.split(':');

    const webdriverConfig = {hostname, port, user, pwd};

    conf.customLaunchers = {
      // Custom Chrome launcher for CI use
      ChromeNoSandbox: {
        base: 'Chrome',
        flags: ['--no-sandbox', '--test-type']
      },
      /*wdEdge: {
        base: 'WebDriver',
        config: webdriverConfig,
        testName,
        pseudoActivityInterval: 30000,
        browserName: 'MicrosoftEdge'
      },*/
      wdIE11: {
        base: 'WebDriver',
        config: webdriverConfig,
        'x-ua-compatible': 'IE=edge',
        testName,
        pseudoActivityInterval: 30000,
        browserName: 'internet explorer'
      },
      wdFirefox: {
        base: 'WebDriver',
        config: webdriverConfig,
        testName,
        pseudoActivityInterval: 30000,
        browserName: 'firefox'
      },
      wdChrome: {
        base: 'WebDriver',
        config: webdriverConfig,
        testName,
        pseudoActivityInterval: 30000,
        browserName: 'chrome'
      }
    };
  }

  return conf;
};
