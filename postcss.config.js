const EMBRACED_STAGE = 3; // See https://cssdb.org/#staging-process

// We are going to use 'postcss-import' only along with Rollup, hence we can still
// keep postcss-import package as a devDependency
// eslint-disable-next-line import/no-extraneous-dependencies
const postcssImport = require('postcss-import');

module.exports = ctx => {
  const isRollup = ctx && ctx.options && ctx.options.isRollup;

  const plugins = [
    require('postcss-modules-values-replace')(),
    require('postcss-preset-env')({
      stage: EMBRACED_STAGE,
      features: {
        'nesting-rules': true
      }
    }),
    require('postcss-font-family-system-ui')({browsers: ['last 2 versions']}),
    require('postcss-flexbugs-fixes')(),
    require('@jetbrains/postcss-require-hover')(),
    require('postcss-calc')({mediaQueries: true})
  ];

  if (isRollup) {
    // We want to remove all "@import" directives from our CSS output when compiling with Rollup
    plugins.unshift(postcssImport());
  }

  return {plugins};
};
