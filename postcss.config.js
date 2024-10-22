const EMBRACED_STAGE = 3; // See https://cssdb.org/#staging-process

module.exports = () => {
  const plugins = [
    require('postcss-modules-values-replace')(),
    require('postcss-preset-env')({
      stage: EMBRACED_STAGE,
      features: {
        'nesting-rules': true,
      },
    }),
    require('postcss-font-family-system-ui')({browsers: ['last 2 versions']}),
    require('postcss-flexbugs-fixes')(),
    require('@jetbrains/postcss-require-hover')(),
    require('postcss-calc')({mediaQueries: true}),
  ];

  return {plugins};
};
