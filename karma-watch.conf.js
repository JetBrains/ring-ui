const mergeOptions = require('merge-options');

const baseConfig = require('./karma-base.conf');

module.exports = config => {
  const configWatch = mergeOptions(baseConfig(config), {
    singleRun: false,
    reporters: ['progress', 'osx'],
    osxReporter: {
      notificationMode: 'change'
    }
  });

  config.set(configWatch);
};
