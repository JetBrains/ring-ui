/* eslint-env node */
/* eslint-disable no-var */
/* eslint-disable modules/no-cjs */

var deepAssign = require('deep-assign');
var generateConfig = require('./karma-base.conf.js');

module.exports = function (config) {
  var configCI = deepAssign(generateConfig(config), {
    browsers: ['wdIE9', 'wdIE10', 'wdIE11', 'wdFirefox', 'wdChrome'],
    coverageReporter: {
      reporters: [
        {type: 'html', dir: 'coverage/'},
        {type: 'teamcity'}
      ]
    },
    reporters: ['teamcity', 'coverage', 'coverage-html-index'],
    webpack: require('./webpack-test-coverage.config'),
    client: {
      mocha: {
        timeout: 60000
      }
    }
  });

  config.set(configCI);
};
