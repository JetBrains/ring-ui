const scssRE = /\.scss$/;

module.exports = ctx => {
  const commonPlugins = {
    'postcss-cssnext': {
      features: {
        calc: {
          mediaQueries: true
        },
        customProperties: {
          preserve: true,
          variables: ctx.options.variables
        }
      }
    },
    'postcss-flexbugs-fixes': {}
  };
  const cssModules = Object.assign({}, {
    'postcss-modules-values-replace': {}
  }, commonPlugins);

  const plugins = scssRE.test(ctx.file.basename)
    ? commonPlugins
    : cssModules;

  return {plugins};
};
