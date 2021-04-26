import path from 'path';

import {babel} from '@rollup/plugin-babel';
import styles from 'rollup-plugin-styles';
import globals from 'rollup-plugin-node-globals';
import replace from '@rollup/plugin-replace';
import clear from 'rollup-plugin-clear';
import browserslist from 'browserslist';
import glob from 'glob';


const files = glob.sync(
  'components/**/*.js',
  {
    ignore: [
      '**/__mocks__/**',
      'components/*-ng/*',
      'components/**/*.test.js',
      'components/**/*.examples.js',

      // highlight.js import does not allow to build these files:
      'components/code/**',
      'components/markdown/**',
      'components/user-agreement/**'
    ]
  }
);

const TARGET_DIR = 'dist';

export default {
  external: id => {
    const isInternal = id.startsWith('.') || id.startsWith('/');
    return !isInternal;
  },

  input: files,

  output: {
    dir: TARGET_DIR,
    format: 'esm',
    // exposed components
    entryFileNames: chunkInfo => {
      const dirName = path.basename(path.dirname(chunkInfo.facadeModuleId));
      return `${dirName}/[name].js`;
    },
    chunkFileNames: '_helpers/[name].js',
    assetFileNames: '[name][extname]' // effective for css styles
  },

  plugins: [
    clear({
      targets: [TARGET_DIR]
    }),

    babel({
      babelHelpers: 'bundled',

      presets: [
        ['@jetbrains/babel-preset-jetbrains', {
          useBuiltIns: 'entry',
          // useBuiltIns: 'usage',
          corejs: '3'
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

    styles({
      modules: true,

      mode: ['extract', 'style.css'],

      config: true,

      minimize: true
    }),

    globals(),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      preventAssignment: true
    })
  ]
};
