/**
 * @name Button Set Ng
 */
import angular from 'angular';

const angularModule = angular.module('Ring.button-set', []);

function rgButtonSet() {
  return {
    restrict: 'E',
    replace: true,
    scope: false,
    transclude: true,
    template: require('./button-set-ng.html')
  };
}

angularModule.directive('rgButtonSet', rgButtonSet);

export default angularModule.name;
