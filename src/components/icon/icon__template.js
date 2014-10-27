/**
 * @fileoverview SVG icons template generator.
 * @author igor.alexeenko@jetbrains.com (Igor Alekseenko)
 */

var fs = require('fs');
var xml2js = require('xml2js');
var xml = require('node-xml-lite');


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
var ELEMENT_PREFIX = 'ring-icon_';


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
 * @return {Object}
 */
var transformFile = function(fileContent, target) {
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
    attributeNames.forEach(function(attribute) {
      if (attributesToExclude.indexOf(attribute) === -1) {
        targetEl['$'][attribute] = fileContent['attrib'][attribute];
      }
    });
  }

  if (fileContent['childs']) {
    fileContent['childs'].forEach(function(child) {
      if (typeof child === 'string') {
        targetEl = child;
      } else {
        targetEl = transformFile(child, targetEl);
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
  fileNames.forEach(function(fileName, i) {
    var fileContent = fileContents[fileName];
    var preprocessedFile = (function preprocessFile(fileContent, fileName) {
      if (fileContent['name'] === 'svg') {
        // todo(igor.alexeenko): What to do if there's some dots in dirname.
        var splitPath = fileName.split('.')[0].split('/').slice(-1)[0];

        fileContent['name'] = 'symbol';
        fileContent['attrib'] = {
          'id': ELEMENT_PREFIX + splitPath,
          'viewBox': fileContent['attrib']['viewBox']
        };
      }

      return fileContent;
    })(fileContent, fileName);

    output['svg'] = transformFile(preprocessedFile, output['svg'], i);
  });

  return (new xml2js.Builder()).buildObject(output);
};


var fileContent = transformSVG(readFiles(__dirname + '/' + SOURCE_DIRECTORY, filenamePattern));

module.exports = ['module.exports = \'' + fileContent.replace(/(\r\n|\n|\r)\s?/g, ''), '\';'].join('');
