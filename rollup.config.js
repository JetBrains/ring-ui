import jsx from 'rollup-plugin-jsx';
import {babel} from '@rollup/plugin-babel';
import embedCSS, {embedCSSPlugin} from 'rollup-plugin-embed-css';
import cjs from 'rollup-plugin-commonjs';
import postcss from 'rollup-plugin-postcss';

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

    'classnames',

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
    embedCSS(),
    embedCSSPlugin(),
    postcss({
      plugins: []
    }),
    cjs({
      exclude: 'node_modules/process-es6/**',
      include: [
        // 'node_modules/create-react-class/**',
        'node_modules/classnames/**'
        // 'node_modules/object-assign/**',
        // 'node_modules/react/**',
        // 'node_modules/react-dom/**',
        // 'node_modules/prop-types/**'
      ]
    })
  ]
};
