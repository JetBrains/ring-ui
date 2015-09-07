/* global angular: false */
import 'babel/polyfill';
import 'dom4';
import 'button-group/button-group.scss';

const css = window.getComputedStyle;

const CLASSNAME_FIRST = 'ring-button-group__first';
const CLASSNAME_LAST = 'ring-button-group__last';

let ringButtonGroupModule = angular.module('Ring.button-group', []);

ringButtonGroupModule.directive('rgButtonGroup', function () {
  return {
    restrict: 'A',
    link: function ($scope, iElement) {
      $scope.$watchCollection(() => {
        // For $watchCollection it should be Array, not jQuery collection
        //return iElement.children(':visible').slice(0);
        return Array.from(iElement[0].children).filter(node => css(node).display !== 'none');
      }, (newVisible, oldVisible) => {
        if (oldVisible && oldVisible.length) {
          oldVisible[0].classList.remove(CLASSNAME_FIRST);
          oldVisible[oldVisible.length - 1].classList.remove(CLASSNAME_LAST);
        }

        if (newVisible && newVisible.length) {
          newVisible[0].classList.add(CLASSNAME_FIRST);
          newVisible[newVisible.length - 1].classList.add(CLASSNAME_LAST);
        }
      });
    }
  };
});
