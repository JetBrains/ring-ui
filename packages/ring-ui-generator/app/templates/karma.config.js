/* eslint-env node */

// Karma configuration

var argv = require('minimist')(process.argv);

var getReporters = function () {
  var reporters = ['progress'];
  if (argv.teamcity) {
    reporters.push('teamcity');
  }
  return reporters;
};

var getWepbackConfig = function () {
  var config = require('./webpack.config.js');
  config.devtool = 'inline-source-map';
  return config;
};

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai', 'chai-as-promised', 'chai-jquery', 'sinon-chai'],


    // list of files / patterns to load in the browser
    files: [
      './src/**/*.test.js',
      'node_modules/es5-shim/es5-shim.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      './src/**/*.test.js': ['webpack', 'sourcemap']
    },

    webpack: getWepbackConfig(),

    webpackServer: {
      noInfo: true
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: getReporters(),


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  });
};
