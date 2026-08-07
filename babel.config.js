module.exports = function config(api) {
  api.cache(true);

  return {
    plugins: [
      [
        'babel-plugin-react-compiler',
        {
          target: '19', // should be the minimal supported version from peerDependencies
          panicThreshold: 'all_errors',
        },
      ],
    ],
    presets: [
      [
        '@jetbrains/babel-preset-jetbrains',
        {
          typeScript: true,
          useBuiltIns: 'usage',
          corejs: '3',
          react: {
            runtime: 'automatic',
          },
        },
      ],
    ],
    env: {
      test: {
        plugins: ['require-context-hook'],
      },
    },
  };
};
