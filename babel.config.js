const browserslist = require('browserslist');

module.exports = function config(api) {
  api.cache(true);

  return {
    presets: [
      ['@jetbrains/jetbrains', {
        angular: true,
        useBuiltIns: 'usage'
      }]
    ],
    plugins: [
      ['transform-define', {
        SUPPORTED_BROWSERS: browserslist()
      }]
    ],
    env: {
      test: {
        plugins: [process.env.IS_JEST
          ? 'require-context-hook'
          : ['istanbul', {
            exclude: [
              '**/*.test.js'
            ]
          }]]
      }
    }
  };
};
