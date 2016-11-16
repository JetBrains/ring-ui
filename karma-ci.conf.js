/* eslint-env node */
/* eslint-disable modules/no-cjs */

const deepAssign = require('deep-assign');
const generateConfig = require('./karma-base.conf.js');

module.exports = config => {
  const configCI = deepAssign(generateConfig(config), {
    browsers: ['wdIE11', 'wdFirefox', 'wdChrome'],
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
