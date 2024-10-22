module.exports = {
  extends: '@jetbrains/stylelint-config',
  plugins: ['@csstools/stylelint-no-at-nest-rule'],
  rules: {
    '@csstools/stylelint-no-at-nest-rule': true,

    'selector-max-specificity': [
      '0,3,0',
      {
        ignoreSelectors: [':global', ':local'],
      },
    ],

    // Disable a few rules temporarily, they should be re-enabled
    'font-family-no-missing-generic-family-keyword': null,
    'no-descending-specificity': null,
    'no-duplicate-selectors': null,

    /**
     * Workaround to highlight inline colors: we should use palette from variables.css where possible
     */
    'color-named': 'never',
    'color-no-hex': true,
  },
};
