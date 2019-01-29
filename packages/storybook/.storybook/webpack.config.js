const ringConfig = require('@jetbrains/ring-ui/webpack.config').config;

module.exports = {
  module: {
    rules: [...ringConfig.module.rules]
  }
};
