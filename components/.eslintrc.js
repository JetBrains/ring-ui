const isCI = process.argv.indexOf('jslint-xml') !== -1;

module.exports = {
  "root": true,
  "parser": "babel-eslint",
  "extends": [
    "jetbrains",
    "jetbrains/es6",
    "jetbrains/react",
    "jetbrains/angular",
    "jetbrains/test"
  ],
  plugins: [
    "flowtype-errors"
  ],
  "rules": {
    // Possible Errors
    "valid-jsdoc": "off",

    // Best Practices
    "complexity": ["off", 5],
    "no-magic-numbers": ["warn", { "ignore": [-1, 0, 1] }],

    // Stylistic Issues
    "func-names": "warn",
    "max-len": ["error", 100, {
      "ignoreComments": true,
      "ignoreTemplateLiterals": true,
      "ignoreRegExpLiterals": true,
      // Strings longer than 40 symbols (half of standard max-len)
      "ignorePattern": "\"(?=([^\"]|\\\"){40,}\")|'(?=([^']|\\'){40,}')"
    }],

    // Angular
    "angular/directive-name": ["error", "rg"],

    // Flow
    "flowtype-errors/show-errors": isCI ? "error" : "off",
    "flowtype-errors/enforce-min-coverage": isCI ? ["error", 50] : "off"
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
