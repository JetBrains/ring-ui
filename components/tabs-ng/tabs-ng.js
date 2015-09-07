/* global angular: false */

import 'tabs/tabs.scss';

/**
 * @name Tabs
 * @example
 * <example name="Tabs-ng">
     <file name="index.html">
       <div ng-app="Ring.tabs">
         <rg-tabs class="container container_tabs">
           <rg-tabs-pane x-title="Settings">Settings tab content</rg-tabs-pane>
           <rg-tabs-pane x-title="Access" counter="7">Access tab content</rg-tabs-pane>
           <rg-tabs-pane x-title="Members">Members tab content</rg-tabs-pane>
           <rg-tabs-pane x-title="Members" counter="666">Members 666 tab content</rg-tabs-pane>
         </rg-tabs>
       </div>
     </file>
     <file name="index.js" webpack="true">
       require('angular/angular.min.js');
       require('angular-route/angular-route.min.js');
       require('tabs-ng/tabs-ng');
     </file>
   </example>
 */
let ringTabsModule = angular.module('Ring.tabs', ['ngRoute']);

ringTabsModule.directive('rgTabs', function ($location, $routeParams, $rootScope) {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      tabParameter: '@',
      tabsClass: '=',
      control: '=?',
      disableLocationChanging: '='
    },
    controller: ['$scope', '$attrs', function ($scope) {
      $scope.panes = [];
      $scope.current = 0;

      function getTabParameterName() {
        return $scope.tabParameter || 'tab';
      }

      function doSelect(newPane, skipUrlUpdate) {
        if (newPane === $scope.panes[$scope.current]) {
          return;
        }

        if (typeof newPane === 'number') {
          let panes = $scope.panes.length - 1;

          if (newPane > panes) {
            newPane = panes;
          } else if (newPane < 0) {
            newPane = 0;
          }

          newPane = $scope.panes[newPane];
        }

        angular.forEach($scope.panes, (pane, index) => {
          // Update current tab
          if (pane === newPane || pane.tabId === newPane) {
            $scope.current = index;
            newPane = pane;
          }

          // Deselect all selected
          if (pane.selected) {
            pane.selected = false;
          }
        });

        newPane.selected = true;

        if (!skipUrlUpdate) {
          $location.search(getTabParameterName(), newPane.tabId);
        }
      }

      this.addPane = pane => {
        if ($scope.panes.length === 0 || pane.tabId === $routeParams[getTabParameterName()]) {
          doSelect(pane, true);
          $scope.current = $scope.panes.length;
        }
        $scope.panes.push(pane);
      };

      $rootScope.$on('$routeUpdate', () => {
        doSelect($routeParams[getTabParameterName()] || 0, true);
      });

      // Exposed methods
      $scope.control = {};

      $scope.control.isLast = () => {
        return $scope.current === $scope.panes.length - 1;
      };

      $scope.control.isFirst = () => {
        return $scope.current === 0;
      };

      $scope.control.select = pane => {
        doSelect(pane, $scope.disableLocationChanging);
      };

      $scope.control.next = () => {
        doSelect($scope.current + 1, $scope.disableLocationChanging);
      };

      $scope.control.prev = () => {
        doSelect($scope.current - 1, $scope.disableLocationChanging);
      };

      $scope.keyMap = {
        next: $scope.control.next,
        prev: $scope.control.prev,
        focus: () => {
          $scope.focus = !$scope.focus;
          return !$scope.focus;
        }
      };

    }],
    template: require('./tabs-ng.html'),
    replace: true
  };
});

ringTabsModule.directive('rgTabsPane', function () {
  return {
    require: '^rgTabs',
    restrict: 'E',
    transclude: true,
    scope: {
      tabId: '@',
      title: '@',
      counter: '@',
      selected: '=?'
    },
    link: function (scope, element, attrs, tabsCtrl) {
      scope.tabId = scope.tabId || scope.title.toLowerCase();
      tabsCtrl.addPane(scope);
    },
    template: '<div class="ring-tabs__content" ng-class="{\'ring-tabs__content_active\':selected}" ng-if="selected" ng-transclude></div>'
  };
});
