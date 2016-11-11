/* eslint-disable modules/no-cjs */

const autoprefixer = require('autoprefixer');
const cssnext = require('postcss-cssnext');
const replaceValues = require('postcss-modules-values-replace');

const scssRE = /\.scss$/;

module.exports = ctx => {
  if (ctx.loader.resourcePath.match(scssRE)) {
    return [autoprefixer];
  }

  return [
    replaceValues({fs: ctx.loader._compiler.inputFileSystem}),
    cssnext
  ];
};
