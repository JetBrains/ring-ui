import angular from 'angular';

import checkmarkIcon from '@jetbrains/icons/checkmark.svg';

import IconNG from '../icon-ng/icon-ng';
import proxyAttrs from '../proxy-attrs/proxy-attrs';

import styles from '../checkbox/checkbox.css';

/**
 * @name Checkbox Ng
 */

const angularModule = angular.module('Ring.checkbox', [IconNG]);

let idCounter = 0;
const CHECKBOX_ID_PREFIX = 'rg-checkbox-';

angularModule.directive('rgCheckbox', function rgCheckboxDirective() {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    template: proxyAttrs(`
<label class="${styles.checkbox}">
  <input
    data-proxy-ng-disabled
    data-proxy-ng-model
    data-proxy-ng-change
    data-proxy-ng-true-value
    data-proxy-ng-false-value
    data-proxy-name
    data-test="ring-checkbox"
    type="checkbox"
    class="${styles.input}"
  />
  <span class="${styles.cell}">
    <rg-icon class="${styles.icon}" glyph="{{:: checkmarkIcon}}" />
  </span><span class="${styles.label}" ng-transclude></span>
</label>
    `),
    link: function link(scope, iElement) {
      scope.checkmarkIcon = checkmarkIcon;
      const input = iElement[0].query('input[type="checkbox"]');

      const id = CHECKBOX_ID_PREFIX + idCounter++;
      iElement[0].setAttribute('for', id);
      input.setAttribute('id', id);
    }
  };
});

export default angularModule.name;
