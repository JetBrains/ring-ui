/**
 * <example> tags parser, inspired by dgeni examples parser
 * https://github.com/angular/dgeni-packages/blob/master/examples/processors/examples-parse.js
 * */
var omit = require('mout/object/omit');

var EXAMPLE_REGEX = /<example([^>]*)>([\S\s]+?)<\/example>/g;
var ATTRIBUTE_REGEX = /\s*([^=]+)\s*=\s*(?:(?:"([^"]+)")|(?:'([^']+)'))/g;
var FILE_REGEX = /<file([^>]*)>([\S\s]+?)<\/file>/g;

function extractAttributes(attributeText) {
  var attributes = {};
  attributeText.replace(ATTRIBUTE_REGEX, function (match, prop, val1, val2) {
    attributes[prop] = val1 || val2;
  });
  return attributes;
}

function extractFiles(exampleText) {
  var files = [];
  exampleText.replace(FILE_REGEX, function (match, attributesText, contents) {
    var file = extractAttributes(attributesText);
    if (!file.name) {
      throw new Error('Missing name attribute in file: ' + match);
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
    var examples = [];
    fileContent.replace(EXAMPLE_REGEX, function processExample(match, attributeText, exampleText) {

      var example = extractAttributes(attributeText);
      example.attributes = omit(example, ['files', 'doc']);
      example.files = extractFiles(exampleText);

      examples.push(example);
    });

    return examples;
  } catch (error) {
    throw new Error('Failed to parse examples' + error);
  }
}

module.exports = parseExamples;
