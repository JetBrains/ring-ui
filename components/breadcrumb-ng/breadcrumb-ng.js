/* global angular: false */

require('breadcrumb/breadcrumb.scss');
require('link/link.scss');

require('react-ng/react-ng')({
  Icon: require('icon/icon')
});

/**
   * @name Breadcrumb
   * @description Breadcrumb component for angularjs apps
   * @example
   * <example name="Breadcrumb-ng">
     <file name="index.html">
       <div ng-app="Ring.breadcrumb">
         <ring-breadcrumb label="First level" link="test/href1">
          <ring-breadcrumb label="Second level" link="test/href2">
            <span>Active level</span>
          </ring-breadcrumb>
         </ring-breadcrumb>
       </div>
     </file>
     <file name="index.js" webpack="true">
       require('angular/angular.min.js');
       require('breadcrumb-ng/breadcrumb-ng');
     </file>
   </example>
 */

angular.module('Ring.breadcrumb', ['Ring.react-ng']).
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
