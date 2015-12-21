/* eslint-env node */
/* eslint-disable no-var */
/* eslint-disable prefer-reflect */
/* eslint-disable modules/no-cjs */

var fs = require('fs');
var path = require('path');

var webpack = require('webpack');
var wallabyWebpack = require('wallaby-webpack');
var webpackConfig = require('./webpack.config');

var babelConfig = JSON.parse(fs.readFileSync('./.babelrc'));
babelConfig.babel = require('babel');

module.exports = function (wallaby) {

  /**
   * Patch webpack config
   */

  webpackConfig.plugins = webpackConfig.plugins || [];
  webpackConfig.plugins.push(new webpack.NormalModuleReplacementPlugin(/\.scss$/, path.resolve('./', './tools/empty-module.js')));

  webpackConfig.module.loaders = webpackConfig.module.loaders
    // removing include because wallaby runs code from own cache dir (wallaby.projectCacheDir)
    .map(function (loader) {
      delete loader.include;

      return loader;
    })
    // removing babel-loader, we will use babel preprocessor instead, it's more performant
    .filter(function (loader) {
      return !loader.loader || loader.loader.indexOf('babel-loader') === -1;
    });

  // fallback to wallaby cache, not to the local folder
  webpackConfig.resolve = {};
  webpackConfig.resolve.fallback = [path.join(wallaby.projectCacheDir, 'components')];

  // not required for wallaby.js
  delete webpackConfig.devtool;
  webpackConfig.output = {};
  webpackConfig.entry = {};
  webpackConfig.cache = {};

  // fallback to local folder, it doesn't matter as we don't instrument these files
  webpackConfig.resolve.fallback.push(path.join(__dirname, 'test-helpers'));

  var wallabyPostprocessor = wallabyWebpack(webpackConfig);

  return {
    files: [
      // test helpers
      {pattern: 'node_modules/karma-phantomjs-shim/shim.js', instrument: false},
      {pattern: 'test-helpers/mocha-globals.js', instrument: false},

      // test frameworks
      {
        pattern: 'node_modules/karma-chai-plugins/node_modules/sinon/pkg/sinon.js',
        instrument: false
      },
      {
        pattern: 'node_modules/karma-chai-plugins/node_modules/chai/chai.js',
        instrument: false
      },
      {
        pattern: 'node_modules/karma-chai-plugins/node_modules/chai-as-promised/lib/chai-as-promised.js',
        instrument: false
      },
      {
        pattern: 'node_modules/karma-chai-plugins/node_modules/chai-dom/chai-dom.js',
        instrument: false
      },
      {
        pattern: 'node_modules/karma-chai-plugins/node_modules/sinon-chai/lib/sinon-chai.js',
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

    testFramework: 'mocha@2.0.1',

    compilers: {
      '**/*.js': wallaby.compilers.babel(babelConfig)
    },

    postprocessor: wallabyPostprocessor,

    bootstrap: function () {
      // required to trigger tests loading
      window.__moduleBundler.loadTests();
    }
  };
};
