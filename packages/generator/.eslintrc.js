const {ignore} = require('@jetbrains/eslint-config/consts');

module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  extends: [
    '@jetbrains',
    '@jetbrains/eslint-config/node',
    '@jetbrains/eslint-config/es6'
  ],
  rules: {
    'import/no-commonjs': ignore
  }
};
