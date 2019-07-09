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
        plugins: [
          ['istanbul', {
            exclude: [
              '**/*.test.js'
            ]
          }]
        ]
      }
    }
  };
};
