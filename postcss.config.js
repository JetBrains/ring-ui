const scssRE = /\.scss$/;

module.exports = ctx => {
  const cssNext = {
    'postcss-cssnext': {
      features: {
        calc: {
          mediaQueries: true
        },
        customProperties: false
      }
    }
  };
  const cssModules = Object.assign({}, {
    'postcss-modules-values-replace': {}
  }, cssNext);

  const plugins = scssRE.test(ctx.file.basename)
    ? cssNext
    : cssModules;

  return {plugins};
};
