/* eslint-env node */
var path = require('path');

var filter = require('mout/array/filter');

var beautify = require('js-beautify');
var parseXML = require('xml-parser');
var buildXML = require('./xml-builder');
var slug = require('slug');

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

function wrapHtml(head, body) {
  return [{
    name: 'html',
    attributes: {},
    children: [{
      name: 'head',
      attributes: {},
      children: head || [],
      content: ''
    }, {
      name: 'body',
      attributes: {},
      children: body || [],
      content: ''
    }],
    content: ''
  }];
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

function exampleProcessor(tagContext, metalsmithContext) {
  var example = parseXML(tagContext.tag.string).root;
  var header = '\n\n### Example: ' + example.attributes.name + '\n';
  var prefix = 'example-' + uniqueName(example.attributes.name || tagContext.name);

  var files = example.children.map(function (exampleFile) {
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

  var scripts = filter(files, {lang: 'js'}).map(function (file) {
    return {
      name: 'script',
      attributes: {
        src: file.fileScriptPath,
        type: 'text/javascript'
      },
      content: ''
    };
  });

  var runnableExamples = filter(files, {fileExt: '.html'}).map(function (file) {
    var link = file.filePath;
    return '<div class="markdown-example">' +
      '<iframe src="' + link + '" class="markdown-example__frame"></iframe>' +
      '<a href="' + link + '" class="markdown-example__link">Example</a>' +
      '</div>';
  }).join('');

  files.forEach(function (file) {
    var content = file.content;
    var children = file.children;

    if (file.fileExt === '.html' && scripts.length) {
      var title = {
        name: 'title',
        attributes: {},
        content: example.attributes.name
      };

      children = wrapHtml([title], file.children.concat(scripts));
    }

    if (content === '' && children.length) {
      content = buildXML(children);
    }

    metalsmithContext.files[file.filePath] = {
      contents: new Buffer(content)
    };

    if (file.webpack) {
      metalsmithContext.files[file.filePath].webpack = file.webpack;
    }
  });

  var contents = files.map(function (file) {
    var content = file.content;

    if (content === '' && file.children.length) {
      content = buildXML(file.children);
    }

    return '\n\n```' + file.fileExt.substring(1) + '\n' + beautify[file.lang](content, beautifyOptions) + '\n```';
  }).join('');

  return header + runnableExamples + contents;
}

module.exports = exampleProcessor;
