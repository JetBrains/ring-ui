import angular from 'angular';

import styles from '../radio/radio.css';
import proxyAttrs from '../proxy-attrs/proxy-attrs';
import getUID from '../global/get-uid';

/**
 * @name Radio Ng
 */
const angularModule = angular.module('Ring.radio', []);

angularModule.directive('rgRadio', function rgCheckboxDirective() {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    template: proxyAttrs(`
      <label class="${styles.radio}" data-test="ring-radio">
        <input
          type="radio"
          class=${styles.input}
          
          data-proxy-ng-disabled
          data-proxy-ng-model
          data-proxy-ng-change
          data-proxy-name
          data-proxy-value
          data-proxy-ng-value
        />
        <span class="${styles.circle}"></span><span
         class="${styles.label}" ng-transclude></span>
      </label>

`),
    link: function link(scope, iElement) {
      const element = iElement[0];
      const input = element.querySelector('input[type="radio"]');

      function usePassedID() {
        const {id} = element;
        element.setAttribute('for', id);
        input.setAttribute('id', id);
        element.removeAttribute('id');
      }

      function generateID() {
        const id = getUID('ring-radio-item-');
        element.setAttribute('for', id);
        input.setAttribute('id', id);
      }

      if (element.id) {
        usePassedID();
      } else {
        generateID();
      }
    }
  };
});

export default angularModule.name;
