import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {basename, dirname, resolve} from 'path';
import dts from 'unplugin-dts/vite';
import {sync} from 'glob';
import autoprefixer from 'autoprefixer';
import postcssRequireHoverPlugin from '@jetbrains/postcss-require-hover';

import {dependencies, peerDependencies} from './package.json';

const files = sync(['src/**/!(*.test|*.stories|*.figma).{ts,tsx,js,jsx}'], {
  ignore: ['**/test-helpers/**', 'src/error-page/**', 'src/error-page-ng/**'],
});

export default defineConfig(config => ({
  build: {
    target: 'es2022',
    minify: config.mode === 'production',
    sourcemap: config.mode !== 'production',

    lib: {
      entry: files,
      formats: ['es'],
      cssFileName: 'style',
    },
    outDir: 'dist',

    rollupOptions: {
      external: [
        'react',
        /^react-dom/,
        'react/jsx-runtime',
        /^@jetbrains\/icons/,
        ...Object.keys(dependencies || {}),
        ...Object.keys(peerDependencies || {}),
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
        entryFileNames: chunkInfo => {
          const facadeModuleId = chunkInfo.facadeModuleId || '';
          const dirName = basename(dirname(facadeModuleId));
          return `${dirName}/[name].js`;
        },
        chunkFileNames: '_chunks/[name].js',
        assetFileNames: '[name][extname]',
      },
    },
  },

  css: {
    modules: {
      exportGlobals: true,
      generateScopedName: '[local]_[hash:base64:4]',
      localsConvention: 'camelCase',
    },
    postcss: {
      plugins: [autoprefixer(), postcssRequireHoverPlugin()],
    },
  },

  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler', {target: '17'}]],
      },
    }),
    dts({
      tsconfigPath: './tsconfig.json',
      include: ['src', 'types'],
    }),
  ],

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@': resolve(__dirname, './src'),
      'test-helpers': resolve(__dirname, './test-helpers'),
    },
  },
}));
