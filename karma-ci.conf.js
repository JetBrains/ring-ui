const mergeOptions = require('merge-options');

const generateConfig = require('./karma-base.conf');

module.exports = config => {
  const configCIDev = mergeOptions(generateConfig(config), {
    reporters: ['teamcity'],
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
