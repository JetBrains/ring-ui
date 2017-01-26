/**
 * @name DOM
 * @category Utilities
 * @description A collection of DOM utilities.
 * @example
   <example name="DOM">
    <file name="index.html">
      TODO example
    </file>
   </example>
 */

export const getStyles = ::window.getComputedStyle;

export function isMounted(node) {
  if (node === document) {
    return true;
  }

  return node instanceof Node && document.documentElement.contains(node.parentNode);
}

const rectStub = {top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0};

export function getRect(node) {
  if (node instanceof Range || isMounted(node)) {
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

export function getDocumentScrollTop() {
  return (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
}

export function getDocumentScrollLeft() {
  return (document.documentElement && document.documentElement.scrollLeft) || document.body.scrollLeft;
}
