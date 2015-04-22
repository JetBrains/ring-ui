/* eslint-env node */
var path = require('path');

var filter = require('mout/array/filter');

var beautify = require('js-beautify');

var slug = require('slug');
var examplesParser = require('./metalsmith-examples-parser');

// Meant to be beautify methods compatible
var langMap = {
  '.js': 'js',
  '.jsx': 'js',
  '.html': 'html',
  '.css': 'css',
  '.scss': 'css'
};

var beautifyOptions = {
  'indent_size': 2
};


var defaultStyles = '<style>\n' +
  '  body, html {\n' +
  '    margin: 0;\n' +
  '    padding: 0;\n' +
  '  };\n' +
  '</style>';

function createHtml(title, body) {
  return '<html>\n' +
    '<head><title>' + title + '</title></head>\n' +
    '<body>' + body + '</body>\n' +
    '</html>';
}

var uniqueNamesMap = Object.create(null);
function uniqueName(name) {
  var normalizedName = slug(name).toLowerCase();

  if (uniqueNamesMap[name] != null) {
    return normalizedName + '-' + ++uniqueNamesMap[name];
  }

  uniqueNamesMap[normalizedName] = 0;
  return normalizedName;
}

function processSingleExample(example, tagContext, metalsmithContext) {
  var header = '\n\n### Example: ' + example.attributes.name + '\n';
  var prefix = 'example-' + uniqueName(example.attributes.name || tagContext.name);

  var files = example.files.map(function (exampleFile) {
    exampleFile.fileName = exampleFile.attributes.name || 'index.js';
    exampleFile.filePath = prefix + '/' + exampleFile.fileName;
    exampleFile.fileExt = path.extname(exampleFile.fileName);
    exampleFile.fileScriptPath = exampleFile.fileName;
    exampleFile.lang = langMap[exampleFile.fileExt];

    if (exampleFile.attributes.webpack) {
      var builtfileBase = prefix + '-' + path.basename(exampleFile.fileName, exampleFile.fileExt);
      exampleFile.webpack = {};
      exampleFile.webpack[builtfileBase] = path.resolve(require.main, metalsmithContext.metalsmith.destination(), exampleFile.filePath);
      exampleFile.fileScriptPath = tagContext.options.publicPath + builtfileBase + '.js';
    }

    return exampleFile;
  });

  var scripts = filter(files, {lang: 'js'});

  var runnableExamples = filter(files, {fileExt: '.html'}).map(function (file) {
    var link = file.filePath;
    return '<div class="markdown-example">' +
      '<iframe src="' + link + '" class="markdown-example__frame"></iframe>' +
      '<a href="' + link + '" class="markdown-example__link">Example</a>' +
      '</div>';
  }).join('');

  files.forEach(function (file) {
    var content = file.fileContents;

    if (file.lang === 'html') {
      var injectedScripts = scripts.map(function (script) {
        return '<script type="text/javascript" src="' + script.fileScriptPath + '"></script>';
      }).join('\n');

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
  var contents = files.map(function (file) {
    var content = file.fileContents;

    return '\n\n```' + file.fileExt.substring(1) + '\n' + beautify[file.lang](content, beautifyOptions) + '\n```';
  }).join('');

  return header + runnableExamples + contents;
}

function exampleProcessor(tagContext, metalsmithContext) {

  var examples = examplesParser(tagContext.tag.string);

  if (!examples.length) {
    return 'Can\'t parse example. Please check example syntax.';
  }

  return examples.map(function (example) {
    return processSingleExample(example, tagContext, metalsmithContext);
  }).join('\n\n---\n\n');
}

module.exports = exampleProcessor;
