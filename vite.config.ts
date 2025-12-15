import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {sync} from 'glob';

import {dependencies, peerDependencies} from './package.json';
// import cssPlugin from '@jetbrains/rollup-css-plugin';

const files = sync(['src/**/!(*.test|*.stories|*.figma).{ts,tsx,js,jsx}'], {
  ignore: ['**/test-helpers/**', 'src/error-page/**', 'src/error-page-ng/**'],
});

export default defineConfig(config => ({
  build: {
    minify: config.mode === 'production',
    sourcemap: config.mode !== 'production',

    lib: {
      entry: files,
      formats: ['es'],
    },
    outDir: 'dist',
    rollupOptions: {
      external: [...Object.keys(dependencies || {}), ...Object.keys(peerDependencies || {})],
      output: {
        entryFileNames: chunkInfo => {
          const facadeModuleId = chunkInfo.facadeModuleId || '';
          const dirName = path.basename(path.dirname(facadeModuleId));
          return `${dirName}/[name].js`;
        },
        // chunkFileNames: '_helpers/[name].js',
        assetFileNames: '[name][extname]',
      },
    },
  },

  css: {
    // postcss: {
    //   config: false,
    //   plugins: [autoprefixer()],
    // },
    modules: {
      exportGlobals: true,
      generateScopedName: '[local]_[hash:base64:4]',
      localsConvention: 'camelCase',
    },
    postcss: './postcss.config.js',
  },

  plugins: [
    react(),
    // dts({
    //   outDir: normalizePath(resolve(__dirname, 'dist/types')),
    //   exclude: ['tests'],
    //   compilerOptions: {
    //     declarationMap: config.mode !== 'production',
    //   },
    // }),

    // cssPlugin({
    //   include: '**/*.css',
    //   exclude: 'node_modules/**',
    //   extract: 'style.css',
    //   // log: console.log, // Uncomment to log CSS processing
    //   minimize: true,
    // }),
  ],

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, './src'),
      'test-helpers': path.resolve(__dirname, './test-helpers'),
    },
  },
}));
