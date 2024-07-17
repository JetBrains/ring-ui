const browserslist = require('browserslist');

module.exports = function config(api) {
  api.cache(true);

  return {
    presets: [
      ['@jetbrains/babel-preset-jetbrains', {
        typeScript: true,
        useBuiltIns: 'usage',
        corejs: '3',
        react: {
          runtime: 'automatic'
        }
      }]
    ],
    plugins: [
      ['babel-plugin-transform-define', {
        SUPPORTED_BROWSERS: browserslist()
      }]
    ],
    env: {
      test: {
        plugins: ['require-context-hook']
      }
    }
  };
};
