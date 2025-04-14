process.env.IS_JEST = true;

module.exports = {
  moduleNameMapper: {
    '\\.(gif|ico|png|md|txt)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.svg$': '<rootDir>/__mocks__/svgMock.js',
    '\\.(css|scss)$': 'identity-obj-proxy',
    '!!file-loader.+': '<rootDir>/__mocks__/fileMock.js',
    '^@jetbrains/ring-ui(.*)$': '<rootDir>$1',
    '^ws$': '<rootDir>/node_modules/ws/index.js',
    // It's needed to fix `ReferenceError: MessageChannel is not defined`
    // https://stackoverflow.com/questions/79506842/react-19-jest-let-test-cases-failed-with-error-referenceerror-messagechannel
    'react-dom/server': 'react-dom/server.edge',
  },
  setupFiles: ['<rootDir>/test-helpers/jest-setup.js', '<rootDir>/test-helpers/jest-globals.js'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  transformIgnorePatterns: [],
  restoreMocks: true,
  testEnvironment: 'jsdom',
};
