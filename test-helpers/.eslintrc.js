const {ignore} = require('@jetbrains/eslint-config/consts');

module.exports = {
  root: true,
  parser: 'babel-eslint',
  extends: [
    '@jetbrains',
    '@jetbrains/eslint-config/es6',
    '@jetbrains/eslint-config/browser',
    '@jetbrains/eslint-config/test',
    '@jetbrains/eslint-config/node'
  ],
  rules: {
    'import/no-commonjs': ignore
  }
};
