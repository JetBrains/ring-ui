import {babel} from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';
import globals from 'rollup-plugin-node-globals';
import replace from '@rollup/plugin-replace';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import clear from 'rollup-plugin-clear';
import browserslist from 'browserslist';


export default {
  external: [
    'react',
    'react-dom',
    'prop-types',
    'classnames',
    'style-inject',
    'conic-gradient',
    'util-deprecate',
    /@jetbrains\/icons\//,
    /node_modules/
  ],
  input: [
    'components/alert/alert.js',
    'components/badge/badge.js'
  ],

  output: {
    dir: 'build',
    format: 'esm'
  },

  plugins: [
    clear({
      targets: ['build']
    }),

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

    postcss({
      config: {
        ctx: {
          isRollup: true
        }
      },
      inject: cssVariableName =>
        `import styleInject from 'style-inject';\nstyleInject(${cssVariableName});`,
      modules: true
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
  ]
};
