const path = require('path');

// We are going to use 'postcss-import' only along with Rollup, hence we can still
// keep postcss-import package as a devDependency
// eslint-disable-next-line import/no-extraneous-dependencies
const postcssImport = require('postcss-import');

const scssRE = /\.scss$/;
const EMBRACED_STAGE = 3; // See https://cssdb.org/#staging-process

module.exports = ctx => {
  const isRollup = ctx && ctx.options && ctx.options.isRollup;

  const plugins = [
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
    require('postcss-font-family-system-ui')(),
    require('postcss-flexbugs-fixes')(),
    require('@jetbrains/postcss-require-hover')(),
    require('postcss-calc')({mediaQueries: true})
  ];

  const isSass = scssRE.test(ctx.file.basename);

  if (isRollup) {
    // We want to remove all "@import" directives from our CSS output when compiling with Rollup
    plugins.unshift(postcssImport());
  }

  if (!isSass) {
    plugins.unshift(require('postcss-modules-values-replace')());
  }

  return {plugins};
};
