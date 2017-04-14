const baseConfig = require('./karma-base.conf.js');

module.exports = config => {
  config.set(baseConfig(config));
};
