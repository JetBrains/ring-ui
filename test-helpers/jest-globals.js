/* eslint-env jest */
import registerRequireContextHook from 'babel-plugin-require-context-hook/register';

import {config} from '../package.json';

registerRequireContextHook();

const serverUri = config.hub;
const clientId = config.clientId;
window.hubConfig = {serverUri, clientId};

class Observer {
  observe() {
    // do nothing
  }

  unobserve() {
    // do nothing
  }

  disconnect() {
    // do nothing
  }
}

global.window.ResizeObserver = Observer;

// https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }))
});
