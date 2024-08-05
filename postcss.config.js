const EMBRACED_STAGE = 3; // See https://cssdb.org/#staging-process


module.exports = () => {
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
    require('postcss-calc')({mediaQueries: true}),
    require('postcss-assign-layer')([
      {
        include: '**/global/*.css',
        layerName: 'ring-ui_global'
      },
      {
        include: '**/!(global)/*.css',
        // Hack to make sure `ring-ui_global` layer is always defined first – and has less priority
        layerName: 'ring-ui_global {} @layer ring-ui'
      }
    ])
  ];

  return {plugins};
};
