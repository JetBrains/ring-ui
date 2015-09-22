export const getStyles = window.getComputedStyle;

export const isMounted = ::document.documentElement.contains;

const rectStub = { top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 };

export function getRect(node) {
  if (isMounted(node) || node instanceof Range) {
    return node.getBoundingClientRect();
  } else {
    return Object.assign({}, rectStub);
  }
}
