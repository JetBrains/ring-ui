const {config} = require('./webpack.config');

module.exports = {
  ...config,
  resolve: {
    alias: {
      '@jetbrains/ring-ui': __dirname
    }
  }
};
