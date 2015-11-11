/* eslint-env node */
/* eslint-disable no-var */
/* eslint-disable modules/no-cjs */

var baseConfig = require('./karma-base.conf.js');

module.exports = function (config) {
  config.set(baseConfig(config));
};
