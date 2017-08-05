const scssRE = /\.scss$/;

module.exports = ctx => {
  const plugins = {
    'postcss-cssnext': {
      features: {
        calc: {
          mediaQueries: true
        },
        customProperties: false
      }
    }
  };

  if (!scssRE.test(ctx.webpack.resourcePath)) {
    plugins['postcss-modules-values-replace'] = {
      fs: ctx.webpack._compiler.inputFileSystem
    };
  }

  return {plugins};
};
