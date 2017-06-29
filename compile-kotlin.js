const {compile} = require('kotlinc-js');

const {libraries} = require('./kotlin-libs');

compile({
  output: 'kotlin_build/kotlin-ring-ui.js',
  sources: 'components',
  sourceMaps: true,
  moduleKind: 'commonjs',
  metaInfo: true,
  libraries: libraries.
    map(file => file.replace(/\.js$/, '.meta.js'))
});
