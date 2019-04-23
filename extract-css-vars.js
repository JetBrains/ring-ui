/**
 * This script parses "global.css" for custom CSS properties and returns an object like
 * {'--main-color': '#FFF'}, which required for postcss-css-properties plugin
 *
 * Inspired by https://github.com/jonathantneal/postcss-export-custom-variables
 */

// eslint-disable-next-line no-console
console.warn(`
  **** WARNING: Ring UI extract-css-vars.js is deprecated since 2.0 in favor of "importFrom" option of postcss-preset-env ****
  **** Consider using the following way of including variables: ****
  'postcss-preset-env': {
    importFrom: require.resolve('@jetbrains/ring-ui/components/global/variables.css'),
    features: {
      'postcss-custom-properties': {
        preserve: true
      }
    }
  }
  **** More details: https://github.com/postcss/postcss-custom-properties#importfrom, https://github.com/csstools/postcss-preset-env#importfrom ***
`);

const fs = require('fs');

const postcss = require('postcss');

const customPropertyMatch = /^--([_a-zA-Z]+[_a-zA-Z0-9-]*)$/;

function isCustomProperty(node) {
  return node.type === 'decl' && customPropertyMatch.test(node.prop);
}

const ExtractVariablesPlugin = postcss.
  plugin('postcss-export-ring-variables', () => {
    const variables = {};

    return (root, result) => {
      root.walk(node => {
        if (isCustomProperty(node)) {
          const [, property] = node.prop.match(customPropertyMatch);

          variables[`--${property}`] = node.value;
        }
      });

      result.parsedVariables = variables;
    };
  });

const variablesSource = fs.
  readFileSync(require.resolve('./components/global/variables.css'));

const res = ExtractVariablesPlugin.
  process(variablesSource.toString(), {}, {}).sync();

module.exports = res.parsedVariables;
