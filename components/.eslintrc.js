const isCI = process.argv.indexOf('jslint-xml') !== -1;

module.exports = {
  "root": true,
  "parser": "babel-eslint",
  "extends": [
    "@jetbrains",
    "@jetbrains/eslint-config/es6",
    "@jetbrains/eslint-config/browser",
    "@jetbrains/eslint-config/react",
    "@jetbrains/eslint-config/angular",
    "@jetbrains/eslint-config/test"
  ],
  "env": {
    "browser": true,
    "mocha": false
  },
  "plugins": [
    "flowtype-errors"
  ],
  "rules": {
    // Possible Errors
    "valid-jsdoc": "off",

    // Best Practices
    "complexity": ["off", 5],
    "no-magic-numbers": ["error", { "ignore": [-1, 0, 1, 2] }],

    // Stylistic Issues
    "max-len": ["error", 100, {
      "ignoreComments": true,
      "ignoreTemplateLiterals": true,
      "ignoreRegExpLiterals": true,
      // Strings longer than 40 symbols (half of standard max-len)
      "ignorePattern": "\"(?=([^\"]|\\\"){40,}\")|'(?=([^']|\\'){40,}')"
    }],
    "quotes": ["error", "single", { "avoidEscape": true }],

    // Angular
    "angular/directive-name": ["error", "rg"],

    // Flow
    "flowtype-errors/show-errors": isCI ? "error" : "off",
    "flowtype-errors/enforce-min-coverage": isCI ? ["error", 50] : "off"
  },
  "overrides": {
    "files": ["**/*.test.js"],
    "env": {
      "mocha": true
    },
    "globals": {
      "sandbox": false
    }
  },
  "settings": {
    "import/resolver": "webpack"
  }
}
