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
    'postcss-modules-values-replace': {
      fs: ctx.webpack._compiler.inputFileSystem
    }
  }, cssNext);

  const plugins = scssRE.test(ctx.webpack.resourcePath)
    ? cssNext
    : cssModules;

  return {plugins};
};
