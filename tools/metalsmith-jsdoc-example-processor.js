/* eslint-disable modules/no-cjs */
/* eslint-disable strict */
'use strict';

const path = require('path');
const filter = require('mout/array/filter');
const beautify = require('js-beautify');
const slug = require('slug');
const examplesParser = require('./metalsmith-examples-parser');

// Meant to be beautify methods compatible
const langMap = {
  '.js': 'js',
  '.jsx': 'js',
  '.html': 'html',
  '.css': 'css',
  '.scss': 'css'
};

const beautifyOptions = {
  indent_size: 2 // eslint-disable-line camelcase
};


const defaultStyles = '<style>\n' +
  '  body, html {\n' +
  '    margin: 0;\n' +
  '    padding: 0;\n' +
  '  };\n' +
  '</style>';

function createHtml(title, body) {
  return `<!DOCTYPE html>\n<html>\n<head><meta charset="UTF-8"><title>${title}</title></head>\n<body>${body}</body>\n</html>`;
}

const uniqueNamesMap = Object.create(null);
function uniqueName(name) {
  const normalizedName = slug(name).toLowerCase();

  if (uniqueNamesMap[name] != null) {
    return `${normalizedName}-${++uniqueNamesMap[name]}`;
  }

  uniqueNamesMap[normalizedName] = 0;
  return normalizedName;
}

function processSingleExample(example, tagContext, metalsmithContext) {
  const header = `\n\n### Example: ${example.attributes.name}\n`;
  const prefix = `example-${uniqueName(example.attributes.name || tagContext.name)}`;

  const files = example.files.map(exampleFile => {
    exampleFile.fileName = exampleFile.attributes.name || 'index.js';
    exampleFile.filePath = `${prefix}/${exampleFile.fileName}`;
    exampleFile.fileExt = path.extname(exampleFile.fileName);
    exampleFile.fileScriptPath = exampleFile.fileName;
    exampleFile.lang = langMap[exampleFile.fileExt];

    if (exampleFile.attributes.webpack) {
      const builtfileBase = `${prefix}-${path.basename(exampleFile.fileName, exampleFile.fileExt)}`;
      exampleFile.webpack = {};
      exampleFile.webpack[builtfileBase] = path.resolve(require.main, metalsmithContext.metalsmith.destination(), exampleFile.filePath);
      exampleFile.fileScriptPath = `${tagContext.options.publicPath + builtfileBase}.js`;
    }

    return exampleFile;
  });

  const scripts = filter(files, {lang: 'js'});

  const runnableExamples = filter(files, {fileExt: '.html'}).map(file => {
    const link = file.filePath;
    return `<div class="markdown-example"><iframe src="${link}" class="markdown-example__frame"></iframe><a href="${link}" class="markdown-example__link">Example</a></div>`;
  }).join('');

  files.forEach(file => {
    let content = file.fileContents;

    if (file.lang === 'html') {
      const injectedScripts = scripts.map(script => `<script type="text/javascript" src="${script.fileScriptPath}"></script>`).join('\n');

      content = createHtml(example.attributes.name, content + defaultStyles + injectedScripts);
    }

    metalsmithContext.files[file.filePath] = {
      contents: new Buffer(content)
    };

    if (file.webpack) {
      metalsmithContext.files[file.filePath].webpack = file.webpack;
    }
  });

  /**
   * Preparing content to display with syntax highliting
   */
  const contents = files.map(file => {
    const content = file.fileContents;

    return `\n\n\`\`\`${file.fileExt.substring(1)}\n${beautify[file.lang](content, beautifyOptions)}\n\`\`\``; // eslint-disable-line no-magic-numbers
  }).join('');

  return header + runnableExamples + contents;
}

function exampleProcessor(tagContext, metalsmithContext) {

  const examples = examplesParser(tagContext.tag.string);

  if (!examples.length) {
    return 'Can\'t parse example. Please check example syntax.';
  }

  return examples.map(example => processSingleExample(example, tagContext, metalsmithContext)).join('\n\n---\n\n');
}

module.exports = exampleProcessor;
