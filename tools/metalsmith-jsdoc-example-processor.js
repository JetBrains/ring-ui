/* eslint-env node */
var path = require('path');

var filter = require('mout/array/filter');
var pluck = require('mout/array/pluck');

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

function exampleProcessor(tagContext, metalsmithContext) {
  var example = parseXML(tagContext.tag.string).root;
  var header = '\n\n### Example: ' + example.attributes.name + '\n';
  var name = example.attributes.name || name + '-' + tagContext.index;
  var directory = 'example-' + slug(name).toLowerCase() + '/';

  var files = example.children.map(function (exampleFile) {
    exampleFile.directory = directory;
    exampleFile.fileName = exampleFile.attributes.name || 'index.js';
    exampleFile.fileExt = path.extname(exampleFile.fileName);
    exampleFile.fileBase = path.basename(exampleFile.fileName, exampleFile.fileExt);
    exampleFile.fileBuiltName = exampleFile.fileName;
    exampleFile.lang = langMap[exampleFile.fileExt];

    if (exampleFile.attributes.webpack) {
      exampleFile.fileBuiltName = exampleFile.fileBase + '.build' + exampleFile.fileExt;
      exampleFile.webpack = {
        entry: path.resolve(__dirname, '..', 'docs', exampleFile.directory, exampleFile.fileName),
        output: {
          path: path.resolve(__dirname, '..', 'docs', exampleFile.directory),
          filename: exampleFile.fileBuiltName,
          pathinfo: true
        }
      };
    }

    return exampleFile;
  });

  var webpackEntries = pluck(filter(files, 'webpack'), 'webpack');

  if (webpackEntries.length) {
    var metadata = metalsmithContext.metalsmith.metadata();
    metadata.webpackEntries = metadata.webpackEntries ?
      metadata.webpackEntries.concat(webpackEntries) :
      webpackEntries;
  }

  var scripts = filter(files, {fileExt: '.js'}).map(function (file) {
    return {
      name: 'script',
      attributes: {
        src: file.fileBuiltName,
        type: 'text/javascript'
      },
      content: ''
    };
  });

  var runnableExamples = filter(files, {fileExt: '.html'}).map(function (file) {
    var link = file.directory + file.fileName;
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

    metalsmithContext.files[file.directory + file.fileName] = {
      contents: new Buffer(content)
    };
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
