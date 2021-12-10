import path from 'path';

import {babel} from '@rollup/plugin-babel';
import styles from 'rollup-plugin-styles';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import clear from 'rollup-plugin-clear';
import glob from 'glob';


const files = glob.sync(
  'components/**/*.{js,jsx}',
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

const extensions = ['.js', '.jsx'];

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

    resolve({extensions}),

    babel({babelHelpers: 'bundled', extensions}),

    // NOTE: styles plugin runs 2 times. First time it applies all the PostCSS transforms
    styles({
      mode: 'emit',
      config: true,
      minimize: false
    }),

    // Second time it applies CSS Modules, extraction and minification. See why https://youtrack.jetbrains.com/issue/RG-2171#focus=Comments-27-5632562.0-0
    styles({
      modules: {
        generateScopedName: '[local]_rui_[hash:4]',
        mode: 'local'
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
