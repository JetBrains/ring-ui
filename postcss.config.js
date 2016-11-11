/* eslint-disable modules/no-cjs */

const autoprefixer = require('autoprefixer');
const cssnext = require('postcss-cssnext');
const replaceValues = require('postcss-modules-values-replace');

const scssRE = /\.scss$/;

module.exports = ctx => {
  const plugins = scssRE.test(ctx.webpack.resourcePath)
    ? [autoprefixer]
    : [replaceValues({fs: ctx.webpack._compiler.inputFileSystem}), cssnext];

  return {plugins};
};
