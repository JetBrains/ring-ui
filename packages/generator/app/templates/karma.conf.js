// Karma configuration

const argv = require('minimist')(process.argv);

module.exports = config => {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha'],


    // list of files / patterns to load in the browser
    files: [
      './test-bundler.js'
    ],


    // list of files to exclude
    exclude: [],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      './test-bundler.js': ['webpack', 'sourcemap']
    },

    webpack: Object.assign({}, require('./webpack.config.js')(), {
      devtool: 'inline-source-map',
      mode: 'development',
      entry: null,
      externals: {
        'react/addons': 'react',
        'react/lib/ExecutionEnvironment': 'react',
        'react/lib/ReactContext': 'react',
        'react-addons-test-utils': 'window'
      }
    }),

    webpackServer: {
      noInfo: true
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: argv.teamcity ? ['progress', 'teamcity'] : ['progress'],


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
    browsers: ['CustomElectron'],

    customLaunchers: {
      CustomElectron: {
        base: 'Electron',
        browserWindowOptions: {
          show: false,
          skipTaskbar: true,
          height: 1024,
          width: 768
        },
        flags: ['--no-sandbox', '--disable-gpu']
      }
    },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  });
};
