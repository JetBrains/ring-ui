import jsx from 'rollup-plugin-jsx';
import {babel} from '@rollup/plugin-babel';
import embedCSS from 'rollup-plugin-embed-css';

/*export default {
  input: 'components/badge/badge.js',
  output: {
    file: 'bundle.js',
    format: 'cjs'
  }
};*/

export default {
  external: [
    'react',
    'prop-types',
    'core-js',
    // path.resolve( __dirname, 'src/some-local-file-that-should-not-be-bundled.js' ),
    /node_modules/
  ],
  input: 'components/badge/badge.js',
  output: {
    dir: 'build',
    // file: 'build/bundle.js',
    format: 'esm'
  },
  // dest: 'build/app.js',
  // entry: 'components/badge/badge.js',
  plugins: [
    babel({
      babelHelpers: 'bundled'
    }),
    jsx({
      factory: 'React.createElement'
    }),
    embedCSS({})
  ]
};
