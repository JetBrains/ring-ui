/* eslint-env node */
/* eslint-disable no-var */
/* eslint-disable modules/no-cjs */

var path = require('path');

var fillIn = require('mout/object/fillIn');
var arrayFind = require('mout/array/find');
var pluck = require('mout/array/pluck');
var flatten = require('mout/array/flatten');

var dox = require('dox');
var slug = require('slug');

function simpleProcessor(tagContext) {
  return tagContext.tag.string;
}

function emptyProcessor() {
  return '';
}

var defaultProcessors = {
  description: simpleProcessor,
  default: emptyProcessor
};

function configure(options) {
  options = options || {};

  var processors = fillIn({}, options.tags || {}, defaultProcessors);

  return function parse(files, metalsmith, done) {
    setImmediate(done);

    Object.keys(files).forEach(function (file) {
      if (!path.extname(file).match(/^\.js|\.jsx|\.scss$/)) {
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
          name: name,
          tag: tag,
          file: file,
          options: options,
          index: index,
          array: array
        }, {
          files: files,
          metalsmith: metalsmith,
          done: done
        });
      });

      files[slug(name).toLowerCase() + '.md'] = fillIn({
        title: name,
        collection: 'jsdoc',
        contents: new Buffer(contents.join(''))
      }, files[file]);

      delete files[file];
    });
  };
}

module.exports = configure;
