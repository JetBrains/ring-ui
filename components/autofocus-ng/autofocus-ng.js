/**
 * @name Autofocus Ng
 */
/* global angular */


/**
 * @name Autofocus Ng
 * @description Sets focus to the element if the condition is true. Supports rg-select as well
 * @example-file ./autofocus-ng__examples.html
 */

const angularModule = angular.module('Ring.autofocus', []);
const RING_SELECT_SELECTOR = '.ring-select';
const RING_SELECT = 'rg-select';

angularModule.directive('rgAutofocus', () => {

  /**
   * Focuses on element itself if it has "focus" method.
   * Searches and focuses on select's button or input if element is rg-select
   * @param element
   */
  function focusOnElement(element) {
    if (!element) {
      return;
    }

    if (element.hasAttribute(RING_SELECT) || element.tagName.toLowerCase() === RING_SELECT) {
      focusOnElement(element.querySelector(RING_SELECT_SELECTOR));
    }

    if (element.focus) {
      element.focus();
    }
  }

  return (scope, iElement, iAttrs) => {
    const element = iElement[0];
    scope.$watch(iAttrs.rgAutofocus, newValue => {
      if (newValue) {
        scope.$evalAsync(() => focusOnElement(element));
      }
    });
  };
});

export default angularModule.name;
