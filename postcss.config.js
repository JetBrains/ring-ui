const path = require('path');

const scssRE = /\.scss$/;
const EMBRACED_STAGE = 3; // See https://cssdb.org/#staging-process

module.exports = ctx => {
  const commonPlugins = [
    require('postcss-preset-env')({
      stage: EMBRACED_STAGE,
      importFrom: path.resolve(__dirname, './components/global/variables.css'),
      features: {
        'nesting-rules': true,
        'custom-properties': {
          preserve: true
        }
      }
    }),
    require('postcss-flexbugs-fixes')(),
    require('@jetbrains/postcss-require-hover')(),
    require('postcss-calc')({mediaQueries: true})
  ];

  const plugins = scssRE.test(ctx.file.basename)
    ? commonPlugins
    : [require('postcss-modules-values-replace')(), ...commonPlugins];

  return {plugins};
};
