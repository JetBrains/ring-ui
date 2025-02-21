import path from 'node:path';
import {fileURLToPath} from 'node:url';

import {fixupConfigRules} from '@eslint/compat';
import globals from 'globals';
import babelParser from '@babel/eslint-parser';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import storybook from 'eslint-plugin-storybook';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import js from '@eslint/js';
import {FlatCompat} from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default tseslint.config(
  {
    ignores: [
      '**/coverage',
      '**/dist',
      '**/components',
      '**/test-app',
      '**/storybook-dist',
      '**/docs',
      '**/html-report',
      '**/node_modules',
      '**/build',
      '**/test_gen',
      '!**/eslint.config.mjs',
      '!**/.storybook',

      '!**/.testplane.conf.js',
    ],
  },
  ...fixupConfigRules(
    compat.extends(
      '@jetbrains',
      '@jetbrains/eslint-config/es6',
      '@jetbrains/eslint-config/browser',
      '@jetbrains/eslint-config/react',
      '@jetbrains/eslint-config/test',
    ),
  ),
  ...storybook.configs['flat/recommended'],

  {
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },

      parser: babelParser,
      parserOptions: {
        //TODO: remove once eslint supports import assertions
        babelOptions: {plugins: ['@babel/plugin-syntax-import-assertions']},
      },
      ecmaVersion: 2023,
      sourceType: 'module',
    },

    settings: {
      'import/core-modules': ['./metadata-messages.json'],
    },

    rules: {
      'valid-jsdoc': 0,
      'import/no-commonjs': 0,

      'consistent-return': 0, // as we rely on tsconfig's noImplicitReturns

      'import/no-extraneous-dependencies': [
        2,
        {
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
            'eslint.config.mjs',
            '.storybook/**',
            'packages/screenshots/**',
            '**/.testplane.conf.js',
            'report-metadata.js',
            'security-audit-ci.js',
            'tsc-teamcity.js',
            'test-runner-jest.config.js',
          ],

          peerDependencies: true,
        },
      ],

      'import/extensions': [
        2,
        'always',
        {
          js: 'never',
          ts: 'never',
          tsx: 'never',
        },
      ],

      camelcase: [
        2,
        {
          allow: ['^UNSAFE_'],
        },
      ],

      'require-await': 2,
      'react/jsx-uses-react': 0,
      'react/react-in-jsx-scope': 0,
      'no-unused-vars': ['error', {caughtErrors: 'none'}],
    },
  },
  {
    files: ['src/**/*'],

    languageOptions: {
      globals: {
        ...globals.browser,
        ...Object.fromEntries(Object.entries(globals.node).map(([key]) => [key, 'off'])),
      },
    },

    settings: {
      'import/resolver': {
        webpack: {
          config: './webpack.config.js',
        },
      },
    },

    rules: {
      complexity: [0, 5],

      'no-magic-numbers': [
        2,
        {
          ignore: [-1, 0, 1, 2],
        },
      ],

      'max-len': [
        2,
        100,
        {
          ignoreComments: true,
          ignoreTemplateLiterals: true,
          ignoreRegExpLiterals: true,
          ignorePattern: '"(?=([^"]|"){40,}")|\'(?=([^\']|\'){40,}\')',
        },
      ],

      'import/no-commonjs': 2,
      'import/no-unused-modules': 0,
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    extends: [importPlugin.flatConfigs.typescript, ...tseslint.configs.recommended],

    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 6,
      sourceType: 'script',

      parserOptions: {
        jsxPragma: null,
      },
    },

    rules: {
      '@typescript-eslint/no-var-requires': 0,
      '@typescript-eslint/explicit-module-boundary-types': 0,
      '@typescript-eslint/no-empty-function': 0,
      'no-use-before-define': 0,
      '@typescript-eslint/no-use-before-define': [2, 'nofunc'],
      'no-shadow': 0,
      '@typescript-eslint/no-shadow': 2,

      '@typescript-eslint/no-unused-vars': [
        2,
        {
          ignoreRestSiblings: true,
          caughtErrors: 'none',
        },
      ],

      '@typescript-eslint/no-unsafe-function-type': 2,
      '@typescript-eslint/no-wrapper-object-types': 2,
      '@typescript-eslint/no-empty-object-type': 0,
      'no-magic-numbers': 0,

      '@typescript-eslint/no-magic-numbers': [
        2,
        {
          ignore: [-1, 0, 1, 2],
          ignoreEnums: true,
          ignoreTypeIndexes: true,
        },
      ],

      'react/prop-types': 0,
    },
  },
  {
    files: ['**/*.test.*', '__mocks__/**'],

    languageOptions: {
      globals: {
        ...globals.jest,
        sandbox: false,
      },
    },

    rules: {
      'new-cap': [
        2,
        {
          capIsNewExceptionPattern: '^.*.UNSAFE_',
        },
      ],

      '@typescript-eslint/no-non-null-assertion': 0,
      '@typescript-eslint/no-unused-expressions': 0,
    },
  },
  {
    files: ['**/*.stories.{js,ts,tsx}'],

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        sandbox: false,
      },
    },

    rules: {
      'react/no-multi-comp': 0,
      'react/jsx-no-literals': 0,
      'react/no-this-in-sfc': 0,
      'react/prop-types': 0,
      'no-magic-numbers': 0,
      '@typescript-eslint/no-magic-numbers': 0,
      'storybook/await-interactions': 2,
      'storybook/context-in-play-function': 2,
      'storybook/default-exports': 2,
      'storybook/hierarchy-separator': 2,
      'storybook/no-redundant-story-name': 2,
      'storybook/story-exports': 2,
      'storybook/use-storybook-expect': 2,
      'storybook/use-storybook-testing-library': 2,
      'storybook/prefer-pascal-case': 'off',
    },
  },
  {
    files: ['test-helpers/**'],
    rules: {
      'import/no-extraneous-dependencies': 'off',
    },
  },
  {
    files: ['eslint.config.mjs'],
    rules: {'no-magic-numbers': 'off'},
  },
  {
    files: ['eslint.config.mjs', 'test-helpers/vitest-setup.js'],
    rules: {'import/no-unresolved': 'off'},
  },
  {files: ['**/*.mjs'], rules: {'import/extensions': ['error', 'ignorePackages']}},

  eslintPluginPrettierRecommended,
  {files: ['**/*.figma.js'], rules: {'import/no-commonjs': 'off'}, languageOptions: {globals: globals.node}},
);
