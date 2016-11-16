/* eslint-disable modules/no-cjs */

const scssRE = /\.scss$/;

module.exports = ctx => {
  const cssModules = {
    'postcss-modules-values-replace': {
      fs: ctx.webpack._compiler.inputFileSystem
    },
    'postcss-cssnext': {
      features: {
        calc: {
          mediaQueries: true
        }
      }
    }
  };

  const autoprefixer = {
    autoprefixer: {}
  };

  const plugins = scssRE.test(ctx.webpack.resourcePath)
    ? autoprefixer
    : cssModules;

  return {plugins};
};
