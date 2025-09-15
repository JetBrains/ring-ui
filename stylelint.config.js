module.exports = {
  extends: ['stylelint-config-sass-guidelines', '@jetbrains/stylelint-config'],
  plugins: ['@csstools/stylelint-no-at-nest-rule'],
  rules: {
    '@csstools/stylelint-no-at-nest-rule': true,
    'selector-class-pattern': null,
    'selector-max-id': null,
    'max-nesting-depth': null,
    'scss/selector-no-redundant-nesting-selector': null,
    'scss/load-no-partial-leading-underscore': null,
    'scss/dollar-variable-pattern': null,
    'color-hex-length': null,
    'selector-max-compound-selectors': null,
    'selector-no-qualifying-type': null,
    'scss/at-import-no-partial-leading-underscore': null,
    'scss/at-mixin-pattern': null,
    'property-no-vendor-prefix': null,
    'length-zero-no-unit': null,
    'scss/at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['value'],
      },
    ],
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
