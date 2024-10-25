import path from 'path';

import {babel} from '@rollup/plugin-babel';
import cssPlugin from '@jetbrains/rollup-css-plugin';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import clear from 'rollup-plugin-clear';
import glob from 'glob';

const files = glob.sync(
  [
    'components/**/*.{js,jsx}',
    // Style-only components
    'components/form/form.css',
    'components/input/input-legacy.css',
    'components/input-size/input-size.css',
  ],
  {
    ignore: [
      '**/__mocks__/**',
      'components/error-page/*', // TODO Error page does not work because of importing GIF file
      'components/error-page-ng/*',
      'components/**/*.test.js',
      'components/**/*.stories.js',
    ],
  },
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
    assetFileNames: '[name][extname]', // effective for css styles
  },

  plugins: [
    clear({
      targets: [TARGET_DIR],
    }),

    json(),

    resolve({extensions}),

    babel({
      babelHelpers: 'bundled',
      browserslistEnv: 'dist',
      // minified: false,
      extensions,
    }),

    cssPlugin({
      include: '**/*.css',
      exclude: 'node_modules/**',
      extract: 'style.css',
      // log: console.log,
      minimize: true,
    }),

    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      preventAssignment: true,
    }),
  ],
};
