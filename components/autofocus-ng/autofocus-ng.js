/* global angular */


/**
 * @name Autofocus ng
 * @description Sets focus to the element if condition is true. Supports rg-select as well
 * @example
 <example name="Autofocus">
 <file name="index.html">
 <div ng-app="Ring.autofocus" class="test-container">
  <input class="ring-input" rg-autofocus="true" placeholder="Should be in focus"/>
 </div>
 </file>
 <file name="index.scss">
  .test-container {
    padding: 8px;
  }
 </file>
 <file name="index.js" webpack="true">
 require('ring-ui/components/input/input.scss');
 require('./index.scss');
 require('angular');
 require('ring-ui/components/autofocus-ng/autofocus-ng');
 </file>
 </example>

  <example name="Autofocus on select">
 <file name="index.html">
   <div ng-app="testApp" ng-controller="testCtrl" class="test-container">
      <rg-select options="item in []" rg-autofocus="true"></rg-select>
   </div>
 </file>
 <file name="index.scss">
 .test-container {
    padding: 8px;
  }
 </file>
 <file name="index.js" webpack="true">
   require('./index.scss');
   require('angular');
   require('ring-ui/components/select-ng/select-ng');
   require('ring-ui/components/autofocus-ng/autofocus-ng');

   angular.module('testApp', ['Ring.select', 'Ring.autofocus'])
    .controller('testCtrl', function($scope) {});
 </file>
 </example>
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
