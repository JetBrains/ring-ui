import {reactNg} from '../react-ng/react-ng';
import Icon from '../icon/icon';

import '../breadcrumb/breadcrumb.scss';
import '../link/link.scss';

registerComponents({Icon});

/**
 * @name Breadcrumb Ng
 * @category Angular Components
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
         .controller('DemoCtrl', ['$scope', function($scope) {
            $scope.clickSecondLevel = function() {
              alert('Second level was clicked');
            }
         }]);
     </file>
 </example>
 */

/* global angular: false */

const angularModule = angular.module('Ring.breadcrumb', [reactNg]);

angularModule.directive('rgBreadcrumb', () => ({
  template: require('./breadcrumb-ng.html'),
  replace: true,
  transclude: true,
  restrict: 'E',

  scope: {
    label: '@',
    link: '@',
    onClick: '&'
  }
}));

export default angularModule.name;
