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
  plugins: [
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

    // React
    "react/no-find-dom-node": "error",

    // Angular
    "angular/directive-name": ["error", "rg"],

    // Flow
    "flowtype-errors/show-errors": isCI ? "error" : "off",
    "flowtype-errors/enforce-min-coverage": isCI ? ["error", 50] : "off"
  },
  "globals": {
    "sandbox": false
  },
  "settings": {
    "import/resolver": {
      "webpack": {
        "config": {
          "resolve": {
            "modules": [
              "test-helpers",
              "node_modules"
            ]
          }
        }
      }
    }
  }
}
