require('core-js/stable');
require('regenerator-runtime/runtime');

const fs = require('fs');
const path = require('path');

const glob = require('glob');

function readMainFileWithExtension(extension, dirpath) {
  const fileName = `${dirpath.substr(dirpath.lastIndexOf(path.sep) + 1)}.${extension}`;
  const filePath = path.join(dirpath, fileName);
  const fileAbsPath = path.resolve(filePath);

  const stats = fs.lstatSync(fileAbsPath);
  return stats && stats.isFile() ? filePath : false;
}

function createEntriesList(dir) {
  return glob.sync(dir).
    filter(filePath => fs.lstatSync(filePath).isDirectory()).
    map(dirpath => {
      try {
        return readMainFileWithExtension('js', dirpath);
      } catch (jsReadErr) {
        try {
          return readMainFileWithExtension('scss', dirpath);
        } catch (e) {
          return false;
        }
      }
    }).
    filter(filePath => filePath !== false);
}

module.exports = createEntriesList;
