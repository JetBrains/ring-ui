import {babel} from '@rollup/plugin-babel';
// import embedCSS, {embedCSSPlugin} from 'rollup-plugin-embed-css';
import postcss from 'rollup-plugin-postcss';

// import cjs from 'rollup-plugin-commonjs';
import globals from 'rollup-plugin-node-globals';
import replace from '@rollup/plugin-replace';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import browserslist from 'browserslist';


export default {
  external: [
    'react',
    'prop-types',
    'classnames',
    /node_modules/
  ],
  input: 'components/badge/badge.js',

  output: {
    dir: 'build',
    format: 'esm'
  },

  plugins: [
    babel({
      babelHelpers: 'bundled',

      presets: [
        ['@jetbrains/babel-preset-jetbrains', {
          useBuiltIns: 'entry',
          // useBuiltIns: 'usage',
          corejs: '2'
        }]
      ],
      plugins: [
        ['babel-plugin-transform-define', {
          SUPPORTED_BROWSERS: browserslist()
        }]
      ],
      env: {
        test: {
          plugins: ['require-context-hook']
        }
      }
    }),

    /*cjs({
      exclude: [
        'node_modules/process-es6/!**'
      ],
      include: [
        'node_modules/create-react-class/!**',
        'node_modules/fbjs/!**',
        'node_modules/object-assign/!**',
        'node_modules/react/!**',
        'node_modules/react-dom/!**',
        'node_modules/prop-types/!**'
      ]
    }),*/

    postcss({
      extensions: ['.css'],
      extract: true
    }),

    globals(),
    replace({
      'process.env.NODE_ENV': JSON.stringify('development'),
      preventAssignment: true
    }),
    nodeResolve({
      browser: true
      // main: true
    })


    /*babel({
      babelHelpers: 'bundled'
    }),
    // jsx({
    //   factory: 'React.createElement'
    // }),
    // embedCSS(),
    // embedCSSPlugin(),
    postcss({
      extensions: ['.css'],
      extract: true
    })
    cjs({
      exclude: 'node_modules/process-es6/!**',
      include: [
        // 'node_modules/create-react-class/!**',
        'node_modules/classnames/!**'
        // 'node_modules/object-assign/!**',
        // 'node_modules/react/!**',
        // 'node_modules/react-dom/!**',
        // 'node_modules/prop-types/!**'
      ]
    })*/
  ]
};
