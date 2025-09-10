/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines */
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {defineConfig} from 'eslint/config';
import globals from 'globals';
import babelParser from '@babel/eslint-parser';
import importPlugin from 'eslint-plugin-import';
import storybook from 'eslint-plugin-storybook';
import prettierConfig from 'eslint-config-prettier/flat';
import unicorn from 'eslint-plugin-unicorn';
import {FlatCompat} from '@eslint/eslintrc';
import eslint from '@eslint/js';
import tsEslint from 'typescript-eslint';

// eslint-disable-next-line no-underscore-dangle
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: eslint.configs.recommended,
  allConfig: eslint.configs.all,
});

// JetBrains configurations with higher priority
const jetbrainsConfigRules = compat.extends(
  '@jetbrains',
  '@jetbrains/eslint-config/es6',
  '@jetbrains/eslint-config/browser',
  '@jetbrains/eslint-config/react',
  '@jetbrains/eslint-config/test',
);

// Remove conflicting import plugin from JetBrains config
jetbrainsConfigRules.forEach(config => {
  if (config.plugins?.import) {
    delete config.plugins.import;
  }
});

export default defineConfig([
  // Global ignores
  {
    ignores: [
      'components',
      'docs',
      '**/coverage',
      '**/dist',
      '**/test-app',
      '**/docs',
      '**/html-report',
      '**/node_modules',
      '**/build',
      '**/test_gen',
    ],
  },

  eslint.configs.recommended,
  importPlugin.flatConfigs.recommended,
  prettierConfig,
  ...jetbrainsConfigRules,

  // Base configuration for all files
  {
    linterOptions: {
      reportUnusedInlineConfigs: 'error',
    },

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ['@babel/preset-env'],
        },
      },
      globals: {
        ...globals.es2021,
      },
    },

    settings: {
      'import/core-modules': ['./metadata-messages.json'],
      'import/resolver': {
        exports: {},
        webpack: true,
      },
      react: {
        version: 'detect',
        runtime: 'automatic',
      },
    },

    rules: {
      'array-callback-return': 'error',
      'block-scoped-var': 'error',
      'consistent-return': 'off', // TypeScript handles this
      curly: ['error', 'multi-line'],
      'default-case-last': 'error',
      'default-param-last': 'error',
      eqeqeq: 'error',
      'max-depth': 'error',
      'max-nested-callbacks': ['error', 5],
      'no-alert': 'error',
      'no-caller': 'error',
      'no-console': 'error',
      'no-debugger': 'error',
      'no-div-regex': 'error',
      'no-duplicate-imports': 'error',
      'no-else-return': ['error', {allowElseIf: false}],
      'no-empty': ['error', {allowEmptyCatch: true}],
      'no-eq-null': 'error',
      'no-eval': 'error',
      'no-extend-native': 'error',
      'no-extra-bind': 'error',
      'no-extra-label': 'error',
      'no-implicit-globals': 'error',
      'no-implied-eval': 'error',
      'no-invalid-this': 'error',
      'no-iterator': 'error',
      'no-lone-blocks': 'error',
      'no-loss-of-precision': 'error',
      'no-multi-str': 'error',
      'no-nested-ternary': 'error',
      'no-new': 'error',
      'no-new-func': 'error',
      'no-new-object': 'error',
      'no-new-wrappers': 'error',
      'no-proto': 'error',
      'no-return-assign': 'error',
      'no-return-await': 'error',
      'no-script-url': 'error',
      'no-self-compare': 'error',
      'no-sequences': 'error',
      'no-throw-literal': 'error',
      'no-undef-init': 'error',
      'no-underscore-dangle': ['error', {allowAfterThis: true}],
      'no-unsafe-finally': 'error',
      'no-unused-expressions': 'error',
      'no-useless-call': 'error',
      'no-useless-concat': 'error',
      'no-useless-return': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',
      'require-await': 'error',
      'use-isnan': 'error',
      yoda: 'error',

      // Import rules
      'import/extensions': ['error', 'always', {js: 'never', jsx: 'never', ts: 'never', tsx: 'never'}],
      'import/no-commonjs': 'off',
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: [
            'webpack-test.config.js',
            'wallaby.config.js',
            'rollup.config.js',
            '*webpack.config.js',
            '**/*.figma.js',
            '**/*.test.{js,ts,tsx}',
            '**/*.stories.{js,ts,tsx}',
            'eslint.config.mjs',
            '.storybook/**',
            '**/.testplane.conf.js',
            'packages/screenshots/**',
            'report-metadata.js',
            'scripts/**',
            'test-runner-jest.config.js',
            'test-helpers/**',
          ],
          peerDependencies: true,
        },
      ],
      'import/order': [
        'error',
        {
          'newlines-between': 'always',
          groups: [
            ['external', 'builtin'],
            ['index', 'sibling', 'parent', 'internal'],
            ['unknown'],
            ['type'],
            ['object'],
          ],
          distinctGroup: true,
        },
      ],
      'import/prefer-default-export': 'off',

      // General rules
      camelcase: ['error', {allow: ['^UNSAFE_'], properties: 'never'}],
      complexity: ['error', 20], // override JetBrains config from 7 to default 20
      'no-unused-vars': ['error', {caughtErrors: 'none'}],
      quotes: ['error', 'single', {avoidEscape: true, allowTemplateLiterals: true}],
      'jsx-quotes': ['error', 'prefer-single'],

      'no-inner-declarations': 'off', // Allow function declarations in blocks
      'max-classes-per-file': 'off', // Allow multiple classes per file
      'max-len': [
        'error',
        120,
        {
          ignoreComments: true,
          ignoreTemplateLiterals: true,
          ignoreRegExpLiterals: true,
          ignorePattern: '"(?=([^"]|"){40,}")|\'(?=([^\']|\'){40,}\')',
        },
      ],
      'max-lines': ['error', {max: 400}],

      'react/jsx-uses-react': 'off', // we support new JSX transform in React 17+
      'react/react-in-jsx-scope': 'off',
      'react/jsx-tag-spacing': 'off',

      // Legacy rules to maintain compatibility
      'valid-jsdoc': 'off',
    },
  },

  // Source files configuration (browser code)
  {
    files: ['src/**/*'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      'import/no-commonjs': 'error',
      'import/no-unused-modules': 'off',
    },
  },

  // TypeScript files configuration
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@typescript-eslint': tsEslint.plugin,
    },
    extends: [tsEslint.configs.recommended],
    languageOptions: {
      parser: tsEslint.parser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        project: './tsconfig.json',
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
        webpack: true,
      },
    },
    rules: {
      'import/no-unresolved': 'error',
      'import/named': 'error',
      'import/no-duplicates': 'error',

      '@typescript-eslint/ban-ts-comment': 'error',
      '@typescript-eslint/consistent-type-assertions': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          fixStyle: 'inline-type-imports',
        },
      ],
      '@typescript-eslint/consistent-type-definitions': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'class',
          format: ['PascalCase'],
        },
      ],
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: false,
        },
      ],
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-this-alias': 'off',
      '@typescript-eslint/no-unused-expressions': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrors: 'none',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/no-useless-constructor': 'error',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-use-before-define': [/* severity */ 2, 'nofunc'],
      '@typescript-eslint/triple-slash-reference': 'error',
      '@typescript-eslint/no-unsafe-function-type': 'error',
      '@typescript-eslint/no-wrapper-object-types': 'error',

      // Disable base rules that are covered by TypeScript equivalents
      'no-shadow': 'off',
      'no-use-before-define': 'off',
      'no-unused-vars': 'off',
      'no-unused-expressions': 'off',

      // Magic numbers rule
      'no-magic-numbers': 'off',
      '@typescript-eslint/no-magic-numbers': [
        'error',
        {
          ignore: [-1, 0, 1, 2],
          ignoreEnums: true,
          ignoreTypeIndexes: true,
          ignoreReadonlyClassProperties: true,
          ignoreArrayIndexes: true,
        },
      ],
    },
  },

  // Component filename rules
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      unicorn,
    },
    rules: {
      // Enforce kebab-case for component files
      'unicorn/filename-case': [
        'error',
        {
          cases: {
            kebabCase: true,
          },
          ignore: [/^[a-z]+(?:-[a-z]+)*(\.(utils|test|constants|classes|interface|stories))?\.tsx?/],
        },
      ],
    },
  },

  // Node.js configuration files and scripts
  {
    files: ['scripts/**/*', 'test-helpers/**/*', 'packages/**/*', '*.config.js', '.prettierrc.js', '.storybook/**/*'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      'import/extensions': 'off',
      'import/no-commonjs': 'off', // Allow CommonJS in Node.js files
    },
  },

  // Test files configuration
  {
    files: ['**/*.test.{js,ts,tsx}', 'test-helpers/mocks/**'],
    languageOptions: {
      globals: {
        ...globals.jest,
        sandbox: false,
      },
    },
    rules: {
      'new-cap': ['error', {capIsNewExceptionPattern: '^.*.UNSAFE_'}],
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-magic-numbers': 'off',
      'no-magic-numbers': 'off',
      'max-lines': 'off',
    },
  },

  // Storybook files configuration
  {
    files: ['**/*.stories.{js,ts,tsx}'],
    plugins: {
      storybook,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        sandbox: false,
      },
    },
    rules: {
      'react/no-multi-comp': 'off',
      'react/jsx-no-literals': 'off',
      'react/no-this-in-sfc': 'off',
      'react/prop-types': 'off',
      'no-magic-numbers': 'off',
      '@typescript-eslint/no-magic-numbers': 'off',
      'max-lines': 'off',

      'storybook/await-interactions': 'error',
      'storybook/context-in-play-function': 'error',
      'storybook/default-exports': 'error',
      'storybook/hierarchy-separator': 'error',
      'storybook/no-redundant-story-name': 'error',
      'storybook/story-exports': 'error',
      'storybook/use-storybook-expect': 'error',
      'storybook/use-storybook-testing-library': 'error',
      'storybook/prefer-pascal-case': 'off',
    },
  },
]);
