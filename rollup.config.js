import {babel} from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';

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

    postcss({
      // extensions: ['.css'],
      config: {
        ctx: {
          isRollup: true
        }
      },
      // extract: true,
      // inject: true,
      inject: cssVariableName =>
        `import styleInject from 'style-inject';\nstyleInject(${cssVariableName});`,
      // extract: path.resolve('build/my-custom-file-name.css'),
      modules: true
      // namedExports: true
      /*processor: css => postcss([autoprefixer])
        .process(css)
        .then(result => result.css)*/
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
