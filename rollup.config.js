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
    'focus-visible',
    'deep-equal',
    'simply-uuid',
    'es6-error',
    'element-resize-detector',
    'combokeys',
    'sniffr',
    'scrollbar-width',
    /@jetbrains\/icons\//
  ],
  input: [
    'components/alert/alert.js',
    'components/alert-service/alert-service.js',
    'components/analytics/analytics.js',
    'components/auth/auth.js',
    'components/auth-dialog/auth-dialog.js',
    'components/auth-dialog-service/auth-dialog-service.js',
    'components/avatar/avatar.js',
    'components/badge/badge.js',
    'components/button/button.js',
    'components/button-group/button-group.js',
    'components/button-set/button-set.js',
    'components/button-toolbar/button-toolbar.js',
    'components/caret/caret.js',
    'components/checkbox/checkbox.js'
    // 'components/code/code.js',
    // 'components/confirm/confirm.js',
    // 'components/confirm-service/confirm-service.js',
    // 'components/content-layout/content-layout.js',
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
