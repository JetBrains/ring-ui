/**
 * @fileoverview SVG icons template generator.
 * @author igor.alexeenko@jetbrains.com (Igor Alekseenko)
 */

var fs = require('fs');
var path = require('path');
var xml2js = require('xml2js');
var xml = require('node-xml-lite');
var Global = require('../global/global');
var ClassName = require('../class-name/class-name');


/**
 * @type {string}
 */
var filenamePattern = '*.svg';


/**
 * @const
 * @type {string}
 */
var SOURCE_DIRECTORY = 'source';


/**
 * @const
 * @type {string}
 */
var ELEMENT_PREFIX = 'ring-icon';


/**
 * @enum {number}
 */
var TransformStrategy = {
  ICON: 'icon',
  LOGO: 'logo'
};


/**
 * @type {Object.<string, TransformStrategy>}
 */
var DirectoryToStrategy = Global.createObject(
    'source', TransformStrategy.ICON,
    'logos', TransformStrategy.LOGO);


/**
 * @type {Array.<string>}
 */
var attributesToExclude = ['fill'];


/**
 * Takes a pathname and returns list of all files in a given directory and child
 * directories.
 * @param {string} path
 * @return {Array.<string>}
 */
var readdirRecursive = function(path) {
  var files = fs.readdirSync(path);
  var output = [];
  var file;

  while ((file = files.shift())) {
    var fPath = path + '/' + file;
    var fStat = fs.lstatSync(fPath);

    if (fStat.isDirectory()) {
      output = output.concat(readdirRecursive(fPath));
    } else {
      output.push(fPath);
    }
  }

  return output;
};

/**
 * @param {string} directory
 * @param {string} pattern
 * @return {Object.<string, string>}
 */
var readFiles = function(directory, pattern) {
  var files = readdirRecursive(directory);
  var fname;
  var fileContents = {};

  var regExp = new RegExp('^' + pattern.replace('.', '\\.').replace('*', '.*') + '$');

  while ((fname = files.shift())) {
    if (regExp.test(fname)) {
      fileContents[fname] = xml.parseFileSync(fname);
    }
  }

  return fileContents;
};


/**
 * @param {string} fileContent
 * @param {Object} target
 * @param {TransformStrategy} strategy
 * @return {Object}
 */
var transformFile = function(fileContent, target, strategy) {
  if (!target) {
    target = {};
  }

  if (!target[fileContent['name']]) {
    target[fileContent['name']] = [];
  }

  var targetEl = {};

  if (fileContent['attrib']) {
    targetEl['$'] = {};

    var attributeNames = Object.keys(fileContent['attrib']);

    switch (strategy) {
      case TransformStrategy.LOGO:
        targetEl['$'] = fileContent['attrib'];
        break;

      // Exclude some parameters only if transforming icon. In case
      // of transforming logotype do not change anything.
      case TransformStrategy.ICON: //jshint -W086
      default:
        attributeNames.forEach(function(attribute) {
          if (attributesToExclude.indexOf(attribute) === -1) {
            targetEl['$'][attribute] = fileContent['attrib'][attribute];
          }
        });
        break;
    }
  }

  if (fileContent['childs']) {
    fileContent['childs'].forEach(function(child) {
      if (typeof child === 'string') {
        targetEl = child;
      } else {
        targetEl = transformFile(child, targetEl, strategy);
      }
    });
  }

  target[fileContent['name']].push(targetEl);

  return target;
};


/**
 * @param {Object.<string, string>} fileContents
 * @return {Object}
 */
var transformSVG = function(fileContents) {
  var output = {
    'svg': {
      '$': {
        'xmlns': 'http://www.w3.org/2000/svg',
        'xmlns:xlink': 'http://www.w3.org/1999/xlink',
        'xmlns:sketch': 'http://www.bohemiancoding.com/sketch/ns'
      }
    }
  };

  var fileNames = Object.keys(fileContents);
  fileNames.forEach(function(fileName) {
    var lastDirectory = path.basename(path.dirname(fileName));
    var strategy = DirectoryToStrategy[lastDirectory] || TransformStrategy.ICON;

    var fileContent = fileContents[fileName];
    var preprocessedFile = (function preprocessFile(fileContent) {
      if (fileContent['name'] === 'svg') {
        var className = new ClassName(ELEMENT_PREFIX);

        fileContent['name'] = 'symbol';
        fileContent['attrib'] = {
          'id': className.getModifier(path.basename(fileName, '.svg')),
          'viewBox': fileContent['attrib']['viewBox']
        };
      }

      return fileContent;
    })(fileContent, fileName);

    output['svg'] = transformFile(preprocessedFile, output['svg'], strategy);
  });

  return (new xml2js.Builder()).buildObject(output);
};


var fileContent = transformSVG(readFiles(__dirname + '/' + SOURCE_DIRECTORY, filenamePattern));

module.exports = ['module.exports = \'' + fileContent.replace(/(\r\n|\n|\r)\s?/g, ''), '\';'].join('');
