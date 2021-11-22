import path from 'path';

import {babel} from '@rollup/plugin-babel';
import styles from 'rollup-plugin-styles';
import replace from '@rollup/plugin-replace';
import clear from 'rollup-plugin-clear';
import glob from 'glob';


const files = glob.sync(
  'components/**/*.js',
  {
    ignore: [
      '**/__mocks__/**',
      'components/error-page/*', // TODO Error page does not work because of importing GIF file
      'components/error-page-ng/*',
      'components/**/*.test.js',
      'components/**/*.examples.js'
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

    babel({babelHelpers: 'bundled'}),

    styles({
      modules: {
        generateScopedName: '[local]_rui_[hash:4]'
      },

      mode: ['extract', 'style.css'],

      config: true,

      minimize: true
    }),

    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      preventAssignment: true
    })
  ]
};
