const path = require('path');

const {compile} = require('kotlinc-js');

const {src, output, moduleName, libraries} = require('../kotlin.conf');

compile({
  output: path.join(output, `${moduleName}.js`),
  sources: src,
  sourceMaps: true,
  metaInfo: true,
  moduleKind: 'commonjs',
  libraries: libraries.
    map(file => file.replace(/\.js$/, '.meta.js'))
});
