process.env.IS_JEST = true;

module.exports = {
  moduleNameMapper: {
    '\\.(html|gif|ico|md|txt)$': '<rootDir>/__mocks__/fileMock.js',
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
