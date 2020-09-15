const mergeOptions = require('merge-options');

const generateConfig = require('./karma-base.conf.js');

process.env.BABEL_ENV = 'test';

module.exports = config => {
  const configCIDev = mergeOptions(generateConfig(config), {
    coverageReporter: {
      reporters: [
        {type: 'html', dir: 'coverage/'},
        {type: 'teamcity'}
      ]
    },
    reporters: ['teamcity', 'coverage', 'coverage-html-index'],
    webpack: require('./webpack-test.config'),
    client: {
      mocha: {
        timeout: 60000
      }
    },
    browsers: ['ChromeHeadlessNoSandbox'],
    browserDisconnectTimeout: 15000,
    browserDisconnectTolerance: 3
  });

  config.set(configCIDev);
};
