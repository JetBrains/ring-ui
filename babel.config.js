const browserslist = require('browserslist');

module.exports = function config(api) {
  api.cache(true);

  return {
    presets: [
      ['@jetbrains/babel-preset-jetbrains', {
        angular: true,
        useBuiltIns: 'usage'
      }]
    ],
    plugins: [
      ['babel-plugin-transform-define', {
        SUPPORTED_BROWSERS: browserslist()
      }]
    ],
    env: {
      test: {
        plugins: [process.env.IS_JEST
          ? 'require-context-hook'
          : ['babel-plugin-istanbul', {
            exclude: [
              '**/*.test.js'
            ]
          }]]
      }
    }
  };
};
