const {config} = require('./webpack.config');

module.exports = {
  ...config,
  resolve: {
    ...config.resolve,
    alias: {
      '@jetbrains/ring-ui': __dirname
    }
  }
};
