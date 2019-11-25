module.exports = {
  moduleNameMapper: {
    '\\.(svg|html|gif|ico|md|txt)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|scss)$': '<rootDir>/__mocks__/styleMock.js'
  },
  setupFiles: [
    '<rootDir>/test-helpers/inject-hub-config.js',
    '<rootDir>/test-helpers/register-context.js'
  ],
  transformIgnorePatterns: [
    'node_modules/(?!react-virtualized)'
  ]
};
