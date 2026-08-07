const interactiveSelector = [
  'a',
  'button',
  'details',
  'input',
  'label',
  'option',
  'select',
  'summary',
  'textarea',
  '[contenteditable]',
  '[role="button"]',
  '[role="checkbox"]',
  '[role="link"]',
  '[role="radio"]',
  '[role="switch"]',
  '[role="tab"]',
].join();

/**
 * If this function returns `false`, the event may be interpreted as a click
 * or tap on a "empty space" rather than on an interactive element such as
 * a button or a link.
 */
export function isWithinInteractiveElement(target: EventTarget | null): boolean {
  return target instanceof Element && target.closest(interactiveSelector) != null;
}
