const browserslist = require('browserslist');
const {createConfigItem} = require('@babel/core');

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
      createConfigItem(require('babel-plugin-transform-define'), {
        SUPPORTED_BROWSERS: browserslist()
      })
    ],
    env: {
      test: {
        plugins: ['require-context-hook']
      }
    }
  };
};
