/* eslint-env node */
/* eslint-disable modules/no-cjs */

const path = require('path');
const wallabyWebpack = require('wallaby-webpack');
const webpackConfig = require('./webpack-test.config');

module.exports = wallaby => {
  webpackConfig.componentsPath.push(path.join(wallaby.projectCacheDir, 'components'));

  return {
    files: [
      // test helpers
      {pattern: 'test-helpers/mocha-globals.js', instrument: false},

      // test frameworks
      {
        pattern: 'node_modules/sinon/pkg/sinon.js',
        instrument: false
      },
      {
        pattern: 'node_modules/chai/chai.js',
        instrument: false
      },
      {
        pattern: 'node_modules/chai-as-promised/lib/chai-as-promised.js',
        instrument: false
      },
      {
        pattern: 'node_modules/chai-dom/chai-dom.js',
        instrument: false
      },
      {
        pattern: 'node_modules/sinon-chai/lib/sinon-chai.js',
        instrument: false
      },
      {
        pattern: 'node_modules/karma-chai-plugins/chai-adapter.js',
        instrument: false
      },

      // files
      {pattern: 'components/**/*.*', load: false},
      {pattern: 'components/**/*.test.js', ignore: true}
    ],

    tests: [
      {pattern: 'components/**/*.test.js', load: false}
    ],

    testFramework: 'mocha',

    compilers: {
      '**/*.js': wallaby.compilers.babel()
    },

    postprocessor: wallabyWebpack(webpackConfig),

    bootstrap: function bootstrap() { // eslint-disable-line object-shorthand
      // required to trigger tests loading
      window.__moduleBundler.loadTests();
    },

    env: {
      kind: 'electron'
    },

    reportConsoleErrorAsError: true
  };
};
