/* global angular: false */

var $ = require('jquery');
require('../button-group/button-group.scss');

var CLASSNAME_FIRST = 'ring-button-group__first';
var CLASSNAME_LAST = 'ring-button-group__last';

angular.module('Ring.button-group', [])
  .directive('rgButtonGroup', [function () {
    return {
      restrict: 'A',
      link: function ($scope, iElement) {
        $scope.$watchCollection(function() {
          // For $watchCollection it should be Array, not jQuery collection
          return iElement.children(':visible').slice(0);
        }, function(newVisible, oldVisible) {
          var $oldVisible = $(oldVisible);
          $oldVisible.first().removeClass(CLASSNAME_FIRST);
          $oldVisible.last().removeClass(CLASSNAME_LAST);

          var $newVisible = $(newVisible);
          $newVisible.first().addClass(CLASSNAME_FIRST);
          $newVisible.last().addClass(CLASSNAME_LAST);
        });
      }
    };
  }]);
