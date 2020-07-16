module.exports = {
  root: true,
  parser: 'babel-eslint',
  extends: [
    '@jetbrains',
    '@jetbrains/eslint-config/node',
    '@jetbrains/eslint-config/es6'
  ],
  rules: {
    'import/no-commonjs': 'off'
  }
};
