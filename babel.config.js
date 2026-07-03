const browserslist = require('browserslist');

module.exports = function config(api) {
  api.cache(true);

  return {
    plugins: [
      [
        'babel-plugin-react-compiler',
        {
          target: '18', // should be the minimal supported version from peerDependencies
          panicThreshold: 'all_errors',
        },
      ],
      [
        'babel-plugin-transform-define',
        {
          SUPPORTED_BROWSERS: browserslist(),
        },
      ],
    ],
    presets: [
      // Inlined @jetbrains/babel-preset-jetbrains, which is incompatible with Babel 8
      [
        '@babel/preset-env',
        {
          // The preset always enabled this transform regardless of targets
          include: ['transform-nullish-coalescing-operator'],
        },
      ],
      '@babel/preset-typescript',
    ],
    overrides: [
      {
        // Replaces `useBuiltIns: 'usage', corejs: '3'`, which was removed from
        // @babel/preset-env in Babel 8. Unlike preset-env, the standalone plugin
        // doesn't skip core-js own files, so injecting polyfill imports into them
        // (under Jest, which transforms node_modules) creates require cycles
        exclude: /node_modules[\\/]core-js[\\/]/,
        plugins: [
          [
            'babel-plugin-polyfill-corejs3',
            {
              method: 'usage-global',
              version: '3.49',
            },
          ],
        ],
      },
      {
        // In Babel 8, JSX parsing must not be enabled for .ts files,
        // otherwise generics like `<T>(...) => ...` fail to parse
        exclude: /\.ts$/,
        presets: [
          [
            '@babel/preset-react',
            {
              runtime: 'automatic',
              // In Babel 8 this defaults to true when NODE_ENV is unset, leaking
              // jsx-dev-runtime into the dist build
              development: false,
            },
          ],
        ],
      },
    ],
    env: {
      test: {
        plugins: ['require-context-hook'],
      },
    },
  };
};
