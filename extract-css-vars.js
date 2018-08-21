/**
 * This script parses "global.css" for custom CSS properties and returns an object like
 * {'--main-color': '#FFF'}, which required for postcss-css-properties plugin
 *
 * Inspired by https://github.com/jonathantneal/postcss-export-custom-variables
 */
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
  readFileSync(require.resolve('./components/global/global.css'));

const res = ExtractVariablesPlugin.
  process(variablesSource.toString(), {}, {}).sync();

module.exports = res.parsedVariables;
