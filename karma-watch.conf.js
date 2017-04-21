const deepAssign = require('deep-assign');

const baseConfig = require('./karma-base.conf.js');

module.exports = config => {
  const configWatch = deepAssign(baseConfig(config), {
    singleRun: false,
    reporters: ['progress', 'osx'],
    osxReporter: {
      notificationMode: 'change'
    }
  });

  config.set(configWatch);
};
