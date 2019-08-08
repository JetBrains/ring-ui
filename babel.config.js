const browserslist = require('browserslist');

const coreJsVersion = process.env.RING_UI_COREJS_VERSION ||
  require('core-js/package.json').version;

module.exports = function config(api) {
  if (api.env() === 'development') {
    // eslint-disable-next-line no-console
    console.info(`Compiling Ring UI with Core JS version "${coreJsVersion}"`);
  }

  api.cache(true);

  return {
    presets: [
      ['@jetbrains/jetbrains', {
        angular: true,
        useBuiltIns: 'usage',
        corejs: coreJsVersion.startsWith('3') ? '3' : '2'
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
