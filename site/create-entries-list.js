/* eslint-env node */
/* eslint-disable modules/no-cjs */
require('babel-polyfill');

const fs = require('fs');
const path = require('path');
const glob = require('glob');

function tryReadMainScssFile(dirpath) {
  const fileName = `${dirpath.substr(dirpath.lastIndexOf(path.sep) + 1)}.scss`;
  const filePath = path.join(dirpath, fileName);
  const fileAbsPath = path.resolve(filePath);

  try {
    const stats = fs.lstatSync(fileAbsPath);
    return stats && stats.isFile() ? `./${filePath}` : false;
  } catch (e) {
    return false;
  }
}

function createEntriesList(dir) {
  return glob.sync(dir).
    filter(filePath => fs.lstatSync(filePath).isDirectory()).
    map(dirpath => {
      const fileName = `${dirpath.substr(dirpath.lastIndexOf(path.sep) + 1)}.js`;
      const filePath = path.join(dirpath, fileName);
      const fileAbsPath = path.resolve(filePath);

      try {
        const stats = fs.lstatSync(fileAbsPath);
        return stats && stats.isFile() ? `./${filePath}` : false;
      } catch (e) {
        return tryReadMainScssFile(dirpath);
      }
    }).
    filter(filePath => filePath !== false);
}

module.exports = createEntriesList;
