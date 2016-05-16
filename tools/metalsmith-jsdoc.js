/* eslint-disable modules/no-cjs */
/* eslint-disable strict */
'use strict';

const path = require('path');
const fillIn = require('mout/object/fillIn');
const arrayFind = require('mout/array/find');
const pluck = require('mout/array/pluck');
const flatten = require('mout/array/flatten');
const dox = require('dox');
const slug = require('slug');

function simpleProcessor(tagContext) {
  return tagContext.tag.string;
}

function emptyProcessor() {
  return '';
}

const defaultProcessors = {
  description: simpleProcessor,
  default: emptyProcessor
};

function configure(options) {
  options = options || {}; // eslint-disable-line no-param-reassign
  const processors = fillIn({}, options.tags || {}, defaultProcessors);

  return function parse(files, metalsmith, done) {
    setImmediate(done);

    Object.keys(files).forEach(file => {
      if (!path.extname(file).match(/^\.js|\.jsx|\.scss$/)) {
        return;
      }

      const comments = dox.parseComments(files[file].contents.toString(), {
        skipSingleStar: true,
        raw: true
      });

      const tags = flatten(pluck(comments, 'tags'));
      const nameObj = arrayFind(tags, {type: 'name'});
      const name = nameObj && nameObj.string.trim();

      if (!name) {
        Reflect.deleteProperty(files, file);
        return;
      }

      const contents = tags.map((tag, index, array) => {
        const processor = processors.hasOwnProperty(tag.type) ? processors[tag.type] : processors.default;

        return processor({
          name,
          tag,
          file,
          options,
          index,
          array
        }, {
          files,
          metalsmith,
          done
        });
      });

      files[`${slug(name).toLowerCase()}.md`] = fillIn({
        title: name,
        collection: 'jsdoc',
        contents: new Buffer(contents.join(''))
      }, files[file]);

      Reflect.deleteProperty(files, file);
    });
  };
}

module.exports = configure;
