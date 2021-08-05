const browserslist = require('browserslist');
const deprecate = require('util-deprecate');

const coreJsVersion = process.env.RING_UI_COREJS_VERSION ||
  require('core-js/package.json').version;

const isDeprecatedCoreJS = coreJsVersion.startsWith('2');

module.exports = function config(api) {
  api.cache(true);

  if (isDeprecatedCoreJS) {
    // TODO remove in 5.0
    deprecate(() => null, `Compiling Ring UI with deprecated Core JS version "${coreJsVersion}". Consider updating to 3rd.`)();
  }

  return {
    presets: [
      ['@jetbrains/babel-preset-jetbrains', {
        typeScript: true,
        angular: true,
        useBuiltIns: 'usage',
        corejs: isDeprecatedCoreJS ? '2' : '3'
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
