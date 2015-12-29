/* global angular */


/**
 * @name Autofocus ng
 * @description Focuses on element if condition is true. Supports rg-select as well
 * @example
 <example name="Autofocus">
 <file name="index.html">
 <div ng-app="Ring.autofocus">
  <input rg-autofocus="true" placeholder="Should be in focus"/>
 </div>
 </file>
 <file name="index.js" webpack="true">
 require('angular');
 require('ring-ui/components/autofocus-ng/autofocus-ng');
 </file>
 </example>

  <example name="Autofocus on select">
 <file name="index.html">
   <div ng-app="testApp" ng-controller="testCtrl">
      <rg-select options="item in []" rg-autofocus="true"></rg-select>
   </div>
 </file>
 <file name="index.js" webpack="true">
   require('angular');
   require('ring-ui/components/select-ng/select-ng');
   require('ring-ui/components/autofocus-ng/autofocus-ng');

   angular.module('testApp', ['Ring.select', 'Ring.autofocus'])
    .controller('testCtrl', function($scope) {});
 </file>
 </example>
 */

const module = angular.module('Ring.autofocus', []);
const RING_SELECT = '.ring-select';

module.directive('rgAutofocus', function () {

  /**
   * Focuses on element itself if it has "focus" method.
   * Searches and focuses on select's button or input if element is rg-select
   * @param element
   */
  function focusOnElement(element) {
    if (!element) {
      return;
    }

    if (element.hasAttribute('rg-select') || element.tagName.toLowerCase() === 'rg-select') {
      focusOnElement(element.querySelector(RING_SELECT));
    }

    if (element.focus) {
      element.focus();
    }
  }

  return function (scope, iElement, iAttrs) {
    const element = iElement[0];
    scope.$watch(iAttrs.rgAutofocus, newValue => {
      if (newValue) {
        scope.$evalAsync(() => focusOnElement(element));
      }
    });
  };
});

export default module.name;
