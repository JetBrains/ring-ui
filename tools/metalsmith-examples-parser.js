/* eslint-disable modules/no-cjs */
/* eslint-disable strict */
'use strict';

const omit = require('mout/object/omit');

const EXAMPLE_REGEX = /<example([^>]*)>([\S\s]+?)<\/example>/g;
const ATTRIBUTE_REGEX = /\s*([^=]+)\s*=\s*(?:(?:"([^"]+)")|(?:'([^']+)'))/g;
const FILE_REGEX = /<file([^>]*)>([\S\s]+?)<\/file>/g;

function extractAttributes(attributeText) {
  const attributes = {};
  attributeText.replace(ATTRIBUTE_REGEX, (match, prop, val1, val2) => {
    attributes[prop] = val1 || val2;
  });
  return attributes;
}

function extractFiles(exampleText) {
  const files = [];
  exampleText.replace(FILE_REGEX, (match, attributesText, contents) => {
    const file = extractAttributes(attributesText);
    if (!file.name) {
      throw new Error(`Missing name attribute in file: ${match}`);
    }

    // Extract the contents of the file
    file.fileContents = contents;
    file.attributes = omit(file, 'fileContents');

    // Store this file information
    files.push(file);
  });
  return files;
}

function parseExamples(fileContent) {
  try {
    const examples = [];
    fileContent.replace(EXAMPLE_REGEX, function processExample(match, attributeText, exampleText) { // eslint-disable-line prefer-arrow-callback

      const example = extractAttributes(attributeText);
      example.attributes = omit(example, ['files', 'doc']);
      example.files = extractFiles(exampleText);

      examples.push(example);
    });

    return examples;
  } catch (error) {
    throw new Error(`Failed to parse examples${error}`);
  }
}

module.exports = parseExamples;
