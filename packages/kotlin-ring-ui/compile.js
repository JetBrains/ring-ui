const {compile} = require('kotlinc-js');
const {src, moduleName, libraries} = require('ring-ui/kotlin.conf');

compile({
  output: `build/${moduleName}.js`,
  sources: src,
  sourceMaps: true,
  metaInfo: true,
  moduleKind: 'commonjs',
  libraries: libraries.
    map(file => file.replace(/\.js$/, '.meta.js'))
});
