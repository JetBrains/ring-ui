/**
 * @name Button Set Ng
 */
import angular from 'angular';

import buttonSetStyles from '../button-set/button-set.css';

const angularModule = angular.module('Ring.button-set', []);

function rgButtonSet() {
  return {
    restrict: 'E',
    replace: true,
    scope: false,
    transclude: true,
    template: `<div class="${buttonSetStyles.buttonSet}" ng-transclude></div>`
  };
}

angularModule.directive('rgButtonSet', rgButtonSet);

export default angularModule.name;
