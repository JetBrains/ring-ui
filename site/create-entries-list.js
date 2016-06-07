/* eslint-env node */
/* eslint-disable modules/no-cjs */
require('babel-polyfill');

const fs = require('fs');
const path = require('path');
const glob = require('glob');

function createEntriesList(dir) {
  return glob.sync(dir).
    filter(filePath => {
      return fs.lstatSync(filePath).isDirectory();
    }).
    map(dirpath => {
      const fileName = `${dirpath.substr(dirpath.lastIndexOf(path.sep) + 1)}.js`;
      const filePath = path.join(dirpath, fileName);
      const fileAbsPath = path.resolve(filePath);
      var stats;

      try {
        stats = fs.lstatSync(fileAbsPath);
      } catch (e) {}

      return stats && stats.isFile() ? `./${filePath}` : false;
    }).
    filter(filePath => {
      return filePath !== false;
    });
}

module.exports = createEntriesList;
