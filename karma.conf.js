// Karma configuration
// Generated on Fri Jul 12 2013 16:30:45 GMT+0400 (MSK)

module.exports = function(karma) {
  karma.set({

    // base path, that will be used to resolve files and exclude
    basePath: '',


    // frameworks to use
    frameworks: ['mocha', 'requirejs', 'chai', 'sinon-chai', 'chai-jquery', 'chai-as-promised'],


    // list of files / patterns to load in the browser
    files: [
      'components/jquery/jquery.js',
      'components/codemirror/lib/codemirror.js',
      'components/raphael/raphael.min.js',

      {pattern: 'blocks/**/*.js', included: false},
      {pattern: 'test/**/*.js', included: false},
      {pattern: 'tmp/**/*.js', included: false},
      {pattern: 'components/**/*.js', included: false},

      'bundles/test.config.js'
    ],


    preprocessors: {
      'blocks/**/*.js': 'coverage'
    },


    // list of files to exclude
    exclude: [
      
    ],


    coverageReporter: {
      type : 'html',
      dir : 'tmp/coverage/'
    },


    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['dots'],


    // web server port
    port: 9876,


    // cli runner port
    runnerPort: 9100,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: karma.LOG_DISABLE || karma.LOG_ERROR || karma.LOG_WARN || karma.LOG_INFO || karma.LOG_DEBUG
    logLevel: karma.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS — only installed
    // - IE (only Windows)
    browsers: ['PhantomJS'],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
