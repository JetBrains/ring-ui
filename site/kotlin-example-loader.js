/* eslint-env node */
/* eslint-disable import/no-commonjs,no-shadow */
const fs = require('fs');

const {compile} = require('kotlinc-js');

const {output, moduleName, libraries} = require('../kotlin.conf');

function noop() {}

module.exports = function kotlinExampleLoader(source) {
  const callback = this.async();
  const TMP_SRC_FILE_NAME = `${__dirname}/_src-tmp.kt`;
  const TMP_FILE_NAME = `${__dirname}/_compiled-tmp.js`;
  const TMP_SOURCE_MAP_FILE_NAME = `${TMP_FILE_NAME}.map`;

  function handleError(e) {
    if (e) {
      callback(e);
      cleanup();
    }
  }

  function cleanup() {
    fs.unlink(TMP_SRC_FILE_NAME, noop);
    fs.unlink(TMP_FILE_NAME, noop);
    fs.unlink(TMP_SOURCE_MAP_FILE_NAME, noop);
  }

  fs.writeFile(TMP_SRC_FILE_NAME, source, e => {
    handleError(e);
    compile({
      output: TMP_FILE_NAME,
      sources: TMP_SRC_FILE_NAME,
      sourceMaps: true,
      moduleKind: 'commonjs',
      libraries: libraries.
        map(file => file.replace(/\.js$/, '.meta.js')).
        concat(require.resolve(`${output}/${moduleName}.meta.js`))
    }).
      then(() => {
        fs.readFile(TMP_FILE_NAME, (e, buffer) => {
          handleError(e);
          fs.readFile(TMP_SOURCE_MAP_FILE_NAME, 'utf8', (e, sourceMap) => {
            handleError(e);
            callback(null, buffer, sourceMap);
            cleanup();
          });
        });
      }).
      catch(handleError);
  });
};
