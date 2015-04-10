/* eslint-env node */
var path = require('path');
var beautify = require('js-beautify');

var fillIn = require('mout/object/fillIn');
var arrayFind = require('mout/array/find');
var pluck = require('mout/array/pluck');
var flatten = require('mout/array/flatten');
var filter = require('mout/array/filter');

var dox = require('dox');
var slug = require('slug');
var parseXML = require('xml-parser');
var buildXML = require('./xml-builder');

function slugify(str) {
  return slug(str).toLowerCase();
}

// Meant to be beautify methods compatible
var langMap = {
  '.js': 'js',
  '.jsx': 'js',
  '.html': 'html',
  '.css': 'css',
  '.scss': 'scss'
};

var beautifyOptions = {
  'indent_size': 2
};

function simpleProcessor(tagContext) {
  return tagContext.tag.string;
}

function emptyProcessor() {
  return '';
}

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

  var files = example.children.map(function (exampleFile) {
    exampleFile.directory = 'example-' + slugify(example.attributes.name || name + '-' + tagContext.index) + '/';
    exampleFile.fileName = exampleFile.attributes.name || 'index.js';
    exampleFile.fileExt = path.extname(exampleFile.fileName);
    exampleFile.fileBase = path.basename(exampleFile.fileName, exampleFile.fileExt);
    exampleFile.fileBuiltName = exampleFile.fileName;
    exampleFile.lang = langMap[exampleFile.fileExt];

    if (exampleFile.attributes.webpack) {
      exampleFile.fileBuiltName = exampleFile.fileBase + '.build' + exampleFile.fileExt;
      exampleFile.webpack = {
        entry: path.resolve('..', 'docs', exampleFile.directory, exampleFile.fileName),
        output: {
          path: path.resolve('..', 'docs', exampleFile.directory),
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
      contents: new Buffer(beautify[file.lang](content, beautifyOptions))
    };
  });

  var contents = files.map(function (file) {
    var content = file.content;

    if (content === '' && file.children.length) {
      content = buildXML(file.children);
    }

    return '\n\n```' + file.lang + '\n' + beautify[file.lang](content, beautifyOptions) + '\n```';
  }).join('');

  return header + runnableExamples + contents;
}

var processors = {
  description: simpleProcessor,
  default: emptyProcessor,
  example: exampleProcessor
};

function configure() {

  return function parse(files, metalsmith, done) {
    setImmediate(done);

    Object.keys(files).forEach(function (file) {
      if (!path.extname(file).match(/^\.js|\.jsx|\.scss$/)) {
        delete files[file];
        return;
      }

      var comments = dox.parseComments(files[file].contents.toString(), {
        skipSingleStar: true,
        raw: true
      });

      var tags = flatten(pluck(comments, 'tags'));
      var nameObj = arrayFind(tags, {type: 'name'});
      var name = nameObj && nameObj.string.trim();

      if (!name) {
        delete files[file];
        return;
      }

      var contents = tags.map(function (tag, index, array) {
        var processor = processors.hasOwnProperty(tag.type) ? processors[tag.type] : processors.default;

        return processor({
          tag: tag,
          file: file,
          index: index,
          array: array
        }, {
          files: files,
          metalsmith: metalsmith,
          done: done
        });
      });

      files[slugify(name) + '.md'] = fillIn({
        title: name,
        contents: new Buffer(contents.join(''))
      }, files[file]);

      delete files[file];
    });
  };
}

module.exports = configure;
