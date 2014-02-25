(function () {
  'use strict';

  angular.module('Ring.btn-group', [])
    .directive('ringBtnGroup', [function () {
      return {
        restrict: 'A',
        link: function ($scope, iElement) {
          $scope.$watchCollection(function() {
            var iVisible = iElement.children(':visible');

            return [iVisible.first()[0], iVisible.last()[0]];
          }, function(oldVisible, newVisible) {
            $(oldVisible).removeClass('ring-btn-group__first ring-btn-group__last');

            var iVisible = $(newVisible);
            iVisible.first().addClass('ring-btn-group__first');
            iVisible.last().addClass('ring-btn-group__last');
          });
        }
      };
    }]);
}());