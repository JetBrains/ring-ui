const deepAssign = require('deep-assign');

const generateConfig = require('./karma-base.conf.js');

process.env.BABEL_ENV = 'test';

module.exports = config => {
  const configCIDev = deepAssign(generateConfig(config), {
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
    browserDisconnectTimeout: 15000,
    browserDisconnectTolerance: 3
  });

  config.set(configCIDev);
};
