/* eslint-disable no-magic-numbers */
const {error, ignore} = require('@jetbrains/eslint-config/consts');

module.exports = {
  parser: 'babel-eslint',
  extends: [
    '@jetbrains',
    '@jetbrains/eslint-config/es6',
    '@jetbrains/eslint-config/browser',
    '@jetbrains/eslint-config/react',
    '@jetbrains/eslint-config/angular',
    '@jetbrains/eslint-config/test'
  ],
  rules: {
    'valid-jsdoc': ignore,
    'import/no-commonjs': ignore,
    'import/no-extraneous-dependencies': [error, {
      devDependencies: [
        'webpack-test.config.js',
        'wallaby.config.js',
        'karma-*.conf.js',
        '**/*.test.js',
        '**/*.examples.js',
        '**/.eslintrc.js',
        '.storybook/**',
        'packages/hermione/**',
        '**/.hermione.conf.js',
        '**/generate-exports.js',
        'report-metadata.js',
        'security-audit-ci.js'
      ],
      peerDependencies: true
    }],
    camelcase: [error, {
      allow: ['^UNSAFE_']
    }]
  },
  env: {
    node: true
  },
  overrides: [
    {
      files: [
        'components/**/*.js'
      ],
      env: {
        browser: true,
        mocha: false,
        node: false
      },
      rules: {
        // Best Practices
        complexity: [ignore, 5],
        'no-magic-numbers': [error, {ignore: [-1, 0, 1, 2]}],

        // Stylistic Issues
        'max-len': [error, 100, {
          ignoreComments: true,
          ignoreTemplateLiterals: true,
          ignoreRegExpLiterals: true,
          // Strings longer than 40 symbols (half of standard max-len)
          ignorePattern: '"(?=([^"]|"){40,}")|\'(?=([^\']|\'){40,}\')'
        }],
        quotes: [error, 'single', {avoidEscape: true}],

        // Angular
        'angular/directive-name': [error, 'rg'],

        // Imports
        'import/no-commonjs': error,
        'import/no-unused-modules': ignore
      },
      settings: {
        'import/resolver': 'webpack',
        'import/core-modules': ['angular']
      }
    },
    {
      files: [
        '**/*.test.js'
      ],
      env: {
        mocha: true,
        jest: true
      },
      globals: {
        sandbox: false
      },
      rules: {
        'new-cap': [error, {
          capIsNewExceptionPattern: '^.*\.UNSAFE_'
        }]
      }
    },
    {
      files: [
        '**/*.examples.js'
      ],
      env: {
        browser: true,
        node: true
      },
      globals: {
        sandbox: false
      },
      rules: {
        'react/no-multi-comp': ignore,
        // It's fine for examples:
        'react/jsx-no-literals': ignore,
        'react/no-this-in-sfc': ignore,
        'react/prop-types': ignore,
        'no-magic-numbers': ignore,
        'angular/no-controller': ignore,
        'angular/di-unused': ignore
      }
    }
  ],
  reportUnusedDisableDirectives: true,
  settings: {
    'import/core-modules': ['./metadata-messages.json']
  }
};
