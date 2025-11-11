module.exports = {
  options: {
    includeOnly: '^src',
    tsConfig: {fileName: 'tsconfig.json'},
    doNotFollow: {
      path: 'node_modules|\\.(css|scss|svg|png|jpe?g)$',
    },
    exclude: '\\.(test|stories)\\.(ts|tsx)$|/(__tests__|__mocks__|stories|docs)/',
    enhancedResolveOptions: {extensions: ['.ts', '.tsx', '.js', '.jsx']},
  },
  forbidden: [{name: 'no-circular', severity: 'error', from: {}, to: {circular: true}}],
};
