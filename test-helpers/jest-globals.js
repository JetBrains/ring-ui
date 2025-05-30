/* eslint-env jest */
import {TextEncoder, TextDecoder} from 'util';
import {MessageChannel} from 'worker_threads';

import registerRequireContextHook from 'babel-plugin-require-context-hook/register';

import {setProjectAnnotations} from '@storybook/react-webpack5';

import {config} from '../package.json';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.MessageChannel = MessageChannel;

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
  value: query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }),
});

setProjectAnnotations(require('../.storybook/preview.ts'));

HTMLDialogElement.prototype.show = jest.fn();
HTMLDialogElement.prototype.showModal = jest.fn();
HTMLDialogElement.prototype.close = jest.fn();
