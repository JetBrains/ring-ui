/**
 * @name Autofocus Ng
 * @category Angular Components
 * @description Sets focus to the element if the condition is true. Supports standard input elements as well as Select.
 * @example-file ./autofocus-ng.examples.html
 */
/* global angular */

const angularModule = angular.module('Ring.autofocus', []);
const RING_SELECT_SELECTOR = '[data-test=ring-select__focus]';
const RING_SELECT = 'rg-select';

angularModule.directive('rgAutofocus', function rgAutofocusDirective() {

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

  // eslint-disable-next-line func-names
  return function (scope, iElement, iAttrs) {
    const element = iElement[0];
    scope.$watch(iAttrs.rgAutofocus, newValue => {
      if (newValue) {
        scope.$evalAsync(() => focusOnElement(element));
      }
    });
  };
});

export default angularModule.name;
