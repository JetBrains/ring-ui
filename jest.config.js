process.env.IS_JEST = true;

module.exports = {
  moduleNameMapper: {
    '\\.(gif|ico|png|md|txt)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.svg$': '<rootDir>/__mocks__/svgMock.js',
    '\\.(css|scss)$': 'identity-obj-proxy',
    '!!file-loader.+': '<rootDir>/__mocks__/fileMock.js',
    '^@jetbrains/ring-ui(.*)$': '<rootDir>$1',
    '^ws$': '<rootDir>/node_modules/ws/index.js',
  },
  setupFiles: ['<rootDir>/test-helpers/jest-setup.js', '<rootDir>/test-helpers/jest-globals.js'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  transformIgnorePatterns: [],
  restoreMocks: true,
  testEnvironment: 'jsdom',
};
