/* global angular: false */
require('babel/polyfill');
require('dom4');
require('../button-group/button-group.scss');

var css = window.getComputedStyle;

var CLASSNAME_FIRST = 'ring-button-group__first';
var CLASSNAME_LAST = 'ring-button-group__last';

angular.module('Ring.button-group', [])
  .directive('rgButtonGroup', [function () {
    return {
      restrict: 'A',
      link: function ($scope, iElement) {
        $scope.$watchCollection(function() {
          // For $watchCollection it should be Array, not jQuery collection
          //return iElement.children(':visible').slice(0);
          return Array.from(iElement[0].children).filter(node => css(node).display !== 'none');
        }, function(newVisible, oldVisible) {
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
  }]);
