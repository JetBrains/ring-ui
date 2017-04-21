const path = require('path');

const wallabyWebpack = require('wallaby-webpack');

const webpackConfig = require('./webpack.config');
const webpackTestConfig = require('./webpack-test.config');

const postcssLoaderPath = require.resolve('postcss-loader');
const addConfig = rule => {
  rule.use.forEach((loader, index) => {
    if (loader === postcssLoaderPath) {
      rule.use[index] = {
        loader,
        options: {
          config: __dirname
        }
      };
    }
  });
};

module.exports = wallaby => {
  webpackConfig.componentsPath.push(path.join(wallaby.projectCacheDir, 'components'));
  webpackTestConfig.entryPatterns = ['test-helpers/mocha-globals.js', 'components/**/*.test.js'];

  addConfig(webpackConfig.loaders.scssLoader);
  addConfig(webpackConfig.loaders.cssLoader);

  return {
    files: [
      // test helpers
      {
        pattern: 'test-helpers/mocha-globals.js',
        instrument: false,
        load: false
      },

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

    postprocessor: wallabyWebpack(webpackTestConfig),

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
