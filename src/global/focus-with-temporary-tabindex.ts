/**
 * Focuses an element, temporarily adding `tabindex="0"` if necessary.
 *
 * If the element does not already have a `tabindex` attribute, one is
 * added before focusing and automatically removed when the element loses
 * focus.
 *
 * This is useful when implementing roving tabindex patterns on elements
 * that are not normally focusable.
 */
export function focusWithTemporaryTabIndex(element: HTMLElement): void {
  if (!element.hasAttribute('tabindex')) {
    element.tabIndex = 0;

    function onBlur() {
      element.removeAttribute('tabindex');
      element.removeEventListener('blur', onBlur);
    }
    element.addEventListener('blur', onBlur);
  }

  element.focus();
}
