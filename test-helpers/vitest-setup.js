import {configure} from '@testing-library/react';
import {vi} from 'vitest';

import './testing-globals.ts';

// jsdom has no layout, so the auto-sizer can never measure a size.
// Give it a fixed viewport so virtualized children are rendered in tests.
vi.mock('react-virtualized-auto-sizer', () => ({
  AutoSizer: ({renderProp}) => renderProp({height: 600, width: 800}),
}));

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
global.window.IntersectionObserver = Observer;

window.HTMLCanvasElement.prototype.getContext = () => null;

// Window-scrolling lists call window.scrollTo, which jsdom does not implement.
window.scrollTo = () => {};

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
