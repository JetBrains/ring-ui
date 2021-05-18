const baseConfig = require('./karma-base.conf');

module.exports = config => {
  config.set(baseConfig(config));
};
