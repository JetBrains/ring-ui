process.env.IS_JEST = true;

module.exports = {
  moduleNameMapper: {
    '\\.(gif|ico|md|txt)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.html$': '<rootDir>/__mocks__/htmlMock.js',
    '\\.svg$': '<rootDir>/__mocks__/svgMock.js',
    '\\.(css|scss)$': 'identity-obj-proxy'
  },
  setupFiles: [
    '<rootDir>/test-helpers/inject-hub-config.js',
    '<rootDir>/test-helpers/register-context.js'
  ],
  transformIgnorePatterns: [
    'node_modules/(?!react-virtualized)'
  ],
  restoreMocks: true
};
