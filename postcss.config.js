/* eslint-disable modules/no-cjs */

const autoprefixer = require('autoprefixer');
const cssnext = require('postcss-cssnext');
const replaceValues = require('postcss-modules-values-replace');

const scssRE = /\.scss$/;

module.exports = ctx => {
  if (scssRE.test(ctx.webpack.resourcePath)) {
    return [autoprefixer];
  }

  return [
    replaceValues({fs: ctx.webpack._compiler.inputFileSystem}),
    cssnext
  ];
};
