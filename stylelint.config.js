module.exports = {
  extends: '@jetbrains/stylelint-config',
  rules: {
    'selector-max-specificity': ['0,3,0', {
      ignoreSelectors: [':global', ':local']
    }],

    // Disable a few rules temporarily, they should be re-enabled
    'font-family-no-missing-generic-family-keyword': null,
    'no-descending-specificity': null,
    'no-duplicate-selectors': null
  }
};
