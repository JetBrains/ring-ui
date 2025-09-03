// https://github.com/facebook/react/issues/11565#issuecomment-1336530089
const originalModule = jest.requireActual('react-dom');

module.exports = {
  ...originalModule,
  createPortal: node => node,
};

export {};
