const navigableSelector = [
  'input:not([type="button"]):not([type="checkbox"]):not([type="color"]):not([type="file"]):not([type="hidden"]):not([type="image"]):not([type="reset"]):not([type="submit"])',
  'textarea',
  'select',
  '[contenteditable]',
  '[role="combobox"]',
  '[role="grid"]',
  '[role="listbox"]',
  '[role="menu"]',
  '[role="menubar"]',
  '[role="radiogroup"]',
  '[role="searchbox"]',
  '[role="slider"]',
  '[role="spinbutton"]',
  '[role="tablist"]',
  '[role="textbox"]',
  '[role="tree"]',
  '[role="treegrid"]',
].join();

/**
 * Returns whether the event target is within an element that is expected to
 * handle keyboard navigation itself, so container-level keyboard shortcuts
 * should generally be ignored.
 */
export function isWithinNavigableElement(target: EventTarget | null): boolean {
  return target instanceof Element && target.closest(navigableSelector) != null;
}
