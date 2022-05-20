const {ignore, error} = require('@jetbrains/eslint-config/consts');

module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  extends: [
    '@jetbrains',
    '@jetbrains/eslint-config/es6',
    '@jetbrains/eslint-config/browser',
    '@jetbrains/eslint-config/test',
    '@jetbrains/eslint-config/node',
    'plugin:import/typescript'
  ],
  rules: {
    'import/no-commonjs': ignore,
    'import/extensions': [error, 'always', {js: 'never', ts: 'never', tsx: 'never'}]
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      extends: ['plugin:@typescript-eslint/recommended']
    }
  ]
};
