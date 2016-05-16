/* eslint-env node */
/* eslint-disable modules/no-cjs */

const baseConfig = require('./karma-base.conf.js');

module.exports = config => {
  config.set(baseConfig(config));
};
