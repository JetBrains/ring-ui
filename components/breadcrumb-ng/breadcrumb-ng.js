/* global angular: false */

require('../breadcrumb/breadcrumb.scss');
require('../link/link.scss');

require('../react-ng/react-ng')({
  Icon: require('../icon/icon')
});

/**
   * @name Breadcrumb Ng
   * @description Breadcrumb component for AngularJS apps
   * @example
   * <example name="Breadcrumb Ng">
     <file name="index.html">
       <div ng-app="Example.breadcrumb">
         <div ng-controller="DemoCtrl">
          <rg-breadcrumb label="First level" link="test/href1">
            <rg-breadcrumb label="Second level" on-click="clickSecondLevel()">
              <span>Active level</span>
            </rg-breadcrumb>
          </rg-breadcrumb>
         </div>
       </div>
     </file>
     <file name="index.js" webpack="true">
       require('angular');
       require('ring-ui/components/breadcrumb-ng/breadcrumb-ng');

       angular.module('Example.breadcrumb', ['Ring.breadcrumb'])
         .controller('DemoCtrl', [
            '$scope',
            function($scope) {
              $scope.clickSecondLevel = function() {
                alert('Second level was clicked');
              }
            }]);
     </file>
   </example>
 */

angular.module('Ring.breadcrumb', ['Ring.react-ng']).
  directive('rgBreadcrumb', function () {
    return {
      template: require('./breadcrumb-ng.html'),
      replace: true,
      transclude: true,
      restrict: 'E',
      scope: {
        label: '@',
        link: '@',
        onClick: '&'
      }
    };
  });
