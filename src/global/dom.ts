/**
 * @name DOM
 */

import {SyntheticEvent} from 'react';
import type {PropertiesHyphen} from 'csstype';

export const getStyles = window.getComputedStyle.bind(window);

export function isMounted(node: Node | Range | null | undefined) {
  if (node === document) {
    return true;
  }

  return node instanceof Node && document.documentElement.contains(node.parentNode);
}

export interface Rect {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
}

const rectStub: Rect = {top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0};

export function getRect(node: Element | Range | null | undefined): Rect {
  if (node instanceof Range || (node != null && isMounted(node))) {
    const {top, right, bottom, left, width, height} = node.getBoundingClientRect();
    return {top, right, bottom, left, width, height};
  } else {
    return Object.assign({}, rectStub);
  }
}

export function getPixelRatio() {
  return 'devicePixelRatio' in window ? window.devicePixelRatio : 1;
}

export function getWindowHeight() {
  return window.innerHeight;
}

export function getWindowWidth() {
  return window.innerWidth;
}

export function isNodeInVisiblePartOfPage(node: Element | Range) {
  const {top, bottom, left, right} = getRect(node);
  return !(bottom < 0 || right < 0 || getWindowHeight() - top < 0 || getWindowWidth() - left < 0);
}

export function getDocumentScrollTop() {
  return (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
}

export function getDocumentScrollLeft() {
  return (document.documentElement && document.documentElement.scrollLeft) || document.body.scrollLeft;
}

export const applyMethodToClasses =
  (method: 'add' | 'remove') =>
  (classList: DOMTokenList, classes = '') => {
    classes
      .split(/\s+/g)
      .filter(className => !!className)
      .forEach(className => classList[method](className));
  };

export const addClasses = applyMethodToClasses('add');
export const removeClasses = applyMethodToClasses('remove');
export const toggleClasses = (classList: DOMTokenList, classes: Record<string, boolean>) =>
  Object.entries(classes).forEach(([className, on]) => classList.toggle(className, on));

export function setRootStyleProperties(properties: PropertiesHyphen = {}) {
  const rootStyle = document.documentElement.style;

  Object.entries(properties).forEach(([key, value]) => {
    rootStyle.setProperty(key, value);
  });
}

export function resetRootStyleProperties(properties: Partial<Record<keyof PropertiesHyphen, unknown>> = {}) {
  const rootStyle = document.documentElement.style;

  Object.keys(properties).forEach(key => rootStyle.removeProperty(key));
}

export class Listeners {
  private _all = new Set<() => void>();

  add<K extends keyof HTMLElementEventMap>(
    el: HTMLElement,
    event: K,
    handler: (this: HTMLElement, ev: HTMLElementEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ): () => void;

  add<K extends keyof WindowEventMap>(
    el: Window,
    event: K,
    handler: (this: Window, ev: WindowEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ): () => void;

  add<K extends keyof DocumentEventMap>(
    el: Document,
    event: K,
    handler: (this: Window, ev: DocumentEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ): () => void;

  add(
    el: HTMLElement | Window | Document,
    event: string,
    handler: (e: Event) => void,
    options?: boolean | AddEventListenerOptions,
  ) {
    el.addEventListener(event, handler, options);
    const dispatchFn = () => el.removeEventListener(event, handler, options);
    this._all.add(dispatchFn);
    return dispatchFn;
  }

  remove(fn: () => void) {
    fn();
    this._all.delete(fn);
  }

  removeAll() {
    this._all.forEach(fn => this.remove(fn));
  }
}

// Synthetic events from Combokeys#trigger are plain objects
export function preventDefault(e: Event | SyntheticEvent) {
  if (e.preventDefault) {
    e.preventDefault();
  }
}
