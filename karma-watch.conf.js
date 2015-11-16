/* eslint-env node */
/* eslint-disable no-var */
/* eslint-disable modules/no-cjs */

var deepAssign = require('deep-assign');
var baseConfig = require('./karma-base.conf.js');

module.exports = function (config) {
  var configWatch = deepAssign(baseConfig(config), {
    singleRun: false,
    reporters: ['progress', 'osx'],
    osxReporter: {
      notificationMode: 'change'
    }
  });

  config.set(configWatch);
};
