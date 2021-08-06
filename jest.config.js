process.env.IS_JEST = true;

module.exports = {
  moduleNameMapper: {
    '\\.(gif|ico|md|txt)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.svg$': '<rootDir>/__mocks__/svgMock.js',
    '\\.(css|scss)$': 'identity-obj-proxy',
    '!!file-loader.+': '<rootDir>/__mocks__/fileMock.js',
    '^@jetbrains/ring-ui(.*)$': '<rootDir>$1'
  },
  setupFiles: [
    '<rootDir>/test-helpers/inject-hub-config.js',
    '<rootDir>/test-helpers/register-context.js',
    '<rootDir>/test-helpers/resize-observer-mock.js'
  ],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest'
  },
  transformIgnorePatterns: [],
  restoreMocks: true,
  testEnvironment: 'jsdom'
};
