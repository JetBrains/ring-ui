(function () {
  'use strict';

  angular.module('Ring.btn-group', [])
    .directive('ringBtnGroup', [function () {
      return {
        restrict: 'A',
        link: function ($scope, iElement) {
          $scope.$watchCollection(function() {
            var iVisible = iElement.children(':visible');

            // For $watchCollection it should be Array, not jQuery collection
            return [iVisible[0], iVisible[iVisible.length - 1]];
          }, function(oldVisible, newVisible) {
            $(oldVisible[0]).removeClass('ring-btn-group__first');
            $(oldVisible[1]).removeClass('ring-btn-group__last');

            $(newVisible[0]).addClass('ring-btn-group__first');
            $(newVisible[1]).addClass('ring-btn-group__last');
          });
        }
      };
    }]);
}());