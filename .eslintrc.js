/* eslint-disable no-magic-numbers */
const {error, ignore} = require('@jetbrains/eslint-config/consts');

module.exports = {
  parser: '@babel/eslint-parser',
  extends: [
    '@jetbrains',
    '@jetbrains/eslint-config/es6',
    '@jetbrains/eslint-config/browser',
    '@jetbrains/eslint-config/react',
    '@jetbrains/eslint-config/test',
    'plugin:import/typescript'
  ],
  rules: {
    'valid-jsdoc': ignore,
    'import/no-commonjs': ignore,
    'import/no-extraneous-dependencies': [error, {
      devDependencies: [
        'webpack-test.config.js',
        'wallaby.config.js',
        'rollup.config.js',
        '*webpack.config.js',
        '**/*.test.js',
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/*.stories.js',
        '**/*.stories.ts',
        '**/*.stories.tsx',
        '**/.eslintrc.js',
        '.storybook/**',
        'packages/hermione/**',
        '**/.hermione.conf.js',
        'report-metadata.js',
        'security-audit-ci.js',
        'tsc-teamcity.js',
        'test-runner-jest.config.js'
      ],
      peerDependencies: true
    }],
    'import/extensions': [error, 'always', {js: 'never', ts: 'never', tsx: 'never'}],
    camelcase: [error, {
      allow: ['^UNSAFE_']
    }],
    // TODO move to @jetbrains/eslint-config
    'require-await': error
  },
  env: {
    node: true
  },
  overrides: [
    {
      files: [
        'src/**/*'
      ],
      env: {
        browser: true,
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

        // Imports
        'import/no-commonjs': error,
        'import/no-unused-modules': ignore
      },
      settings: {
        'import/resolver': {
          webpack: {
            config: './webpack.config.js'
          }
        }
      }
    },
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      extends: ['plugin:@typescript-eslint/recommended'],
      rules: {
        '@typescript-eslint/no-var-requires': ignore,
        '@typescript-eslint/explicit-module-boundary-types': ignore,
        '@typescript-eslint/no-empty-function': ignore,
        'no-use-before-define': ignore,
        '@typescript-eslint/no-use-before-define': [error, 'nofunc'],
        'no-shadow': ignore,
        '@typescript-eslint/no-shadow': error,
        '@typescript-eslint/no-unused-vars': [error, {
          ignoreRestSiblings: true
        }],
        '@typescript-eslint/ban-types': [error, {
          extendDefaults: true,
          types: {object: false, '{}': false}
        }],
        'no-magic-numbers': ignore,
        '@typescript-eslint/no-magic-numbers': [error, {
          ignore: [-1, 0, 1, 2],
          ignoreEnums: true,
          ignoreTypeIndexes: true
        }],
        'react/prop-types': ignore
      }
    },
    {
      files: [
        '**/*.test.*',
        '__mocks__/**'
      ],
      env: {
        jest: true
      },
      globals: {
        sandbox: false
      },
      rules: {
        'new-cap': [error, {
          capIsNewExceptionPattern: '^.*\.UNSAFE_'
        }],
        '@typescript-eslint/no-non-null-assertion': ignore
      }
    },
    {
      files: [
        '**/*.stories.*'
      ],
      plugins: ['storybook'],
      env: {
        browser: true,
        node: true
      },
      globals: {
        sandbox: false
      },
      rules: {
        'react/no-multi-comp': ignore,
        // It's fine for stories:
        'react/jsx-no-literals': ignore,
        'react/no-this-in-sfc': ignore,
        'react/prop-types': ignore,
        'no-magic-numbers': ignore,
        '@typescript-eslint/no-magic-numbers': ignore,
        'storybook/await-interactions': error,
        'storybook/context-in-play-function': error,
        'storybook/default-exports': error,
        'storybook/hierarchy-separator': error,
        'storybook/no-redundant-story-name': error,
        'storybook/story-exports': error,
        'storybook/use-storybook-expect': error,
        'storybook/use-storybook-testing-library': error
      }
    }
  ],
  reportUnusedDisableDirectives: true,
  settings: {
    'import/core-modules': ['./metadata-messages.json']
  }
};
