// Karma configuration
// Generated on Fri Jul 12 2013 16:30:45 GMT+0400 (MSK)

module.exports = function (karma) {
  var prepareWbpackConf = function (webpackConf) {
    webpackConf.devtool = 'eval';
    webpackConf.output = {};
    return webpackConf;
  };

  karma.set({

    // base path, that will be used to resolve files and exclude
    basePath: '',


    // frameworks to use
    frameworks: ['jasmine'],


    // Files are given outside from gulp task
    files: [
      'node_modules/jquery/dist/jquery.js',
      'node_modules/jso/jso.js',
      'test-helpers/*.js',
      'src/components/**/*.test.js'
    ],

    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress'],

    // list of preprocessors
    preprocessors: {
      'src/components/**/*.test.js': ['webpack']
    },

    webpack: prepareWbpackConf(require('./webpack.conf.js')),

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
        flags: ['--no-sandbox']
      }
    },


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true
  });
};
