const path = require('path');

const wallabyWebpack = require('wallaby-webpack');

const webpackConfig = require('./webpack.config');
const webpackTestConfig = require('./webpack-test.config');

module.exports = wallaby => {
  webpackConfig.componentsPath.
    push(path.join(wallaby.projectCacheDir, 'components'));
  webpackTestConfig.entryPatterns = [
    'test-helpers/mocha-globals.js',
    'test-helpers/enzyme-configuration.js',
    'components/**/*.test.js'
  ];

  return {
    files: [
      {pattern: 'components/**/*.*', load: false},
      {pattern: 'test-helpers/**/*.js', load: false},
      {pattern: 'postcss.config.js', instrument: false, load: false},
      {pattern: 'components/**/*.test.js', ignore: true}
    ],

    tests: [
      {pattern: 'components/**/*.test.js', load: false}
    ],

    testFramework: 'mocha',

    compilers: {
      '**/*.js': wallaby.compilers.babel(
        JSON.parse(require('fs').readFileSync('.babelrc'))
      )
    },

    postprocessor: wallabyWebpack(webpackTestConfig),

    bootstrap: function bootstrap() {
      // required to trigger tests loading
      window.__moduleBundler.loadTests();
    },

    env: {
      kind: 'electron'
    },

    reportConsoleErrorAsError: true
  };
};
