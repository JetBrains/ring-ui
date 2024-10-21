import {configure} from '@testing-library/react';

import './testing-globals.ts';
import './enzyme-configuration';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

configure({testIdAttribute: 'data-test'});

window.PointerEvent = window.PointerEvent || window.Event;

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

window.HTMLCanvasElement.prototype.getContext = () => null;

// https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});
