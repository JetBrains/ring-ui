module.exports = {
  "parser": "babel-eslint",
  "extends": [
    "@jetbrains",
    "@jetbrains/eslint-config/es6",
    "@jetbrains/eslint-config/browser",
    "@jetbrains/eslint-config/react",
    "@jetbrains/eslint-config/angular",
    "@jetbrains/eslint-config/test"
  ],
  "rules": {
    "valid-jsdoc": "off",
    "import/no-commonjs": "off"
  },
  "env": {
    "node": true
  },
  "overrides": [
    {
      "files": [
        "components/**/*.js"
      ],
      "env": {
        "browser": true,
        "mocha": false,
        "node": false
      },
      "rules": {
        // Best Practices
        "complexity": ["off", 5],
        "no-magic-numbers": ["error", {"ignore": [-1, 0, 1, 2]}],

        // Stylistic Issues
        "max-len": ["error", 100, {
          "ignoreComments": true,
          "ignoreTemplateLiterals": true,
          "ignoreRegExpLiterals": true,
          // Strings longer than 40 symbols (half of standard max-len)
          "ignorePattern": "\"(?=([^\"]|\\\"){40,}\")|'(?=([^']|\\'){40,}')"
        }],
        "quotes": ["error", "single", {"avoidEscape": true}],

        // Angular
        "angular/directive-name": ["error", "rg"]
      },
      "settings": {
        "import/resolver": "webpack"
      }
    },
    {
      "files": [
        "**/*.test.js"
      ],
      "env": {
        "mocha": true
      },
      "globals": {
        "sandbox": false
      }
    }
  ]
};
