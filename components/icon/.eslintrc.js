/* eslint-disable import/no-commonjs,no-undef */
const {ignore} = require('@jetbrains/eslint-config/consts');

module.exports = {
  overrides: [
    {
      files: ['logos.js'],
      rules: {
        'max-len': ignore
      }
    },
    {
      files: ['generate-exports.js'],
      env: {
        node: true
      },
      rules: {
        'import/no-commonjs': ignore
      },
      settings: {
        'import/core-modules': ['path']
      }
    }
  ]
};
