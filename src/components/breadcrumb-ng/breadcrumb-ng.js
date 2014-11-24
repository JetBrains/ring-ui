/* global angular: false */

require('breadcrumb/breadcrumb.scss');

/**
   * <ring-breadcrumb title="{{title}} link="{{link}}">
   *   <ring-breadcrumb title="{{title}} link="{{link}}">content</ring-breadcrumb>
   * </ring-breadcrumb>">
   */
angular.module('Ring.breadcrumb', []).
  directive('ringBreadcrumb', [function () {
    return {
      template: require('./breadcrumb-ng.html'),
      replace: true,
      transclude: true,
      restrict: 'E',
      scope: {
        label: '@',
        link: '@'
      }
    };
  }]);
