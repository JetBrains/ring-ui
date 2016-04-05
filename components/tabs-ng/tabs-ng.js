/* global angular: false */

import '../tabs/tabs.scss';

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
       require('angular');
       require('angular-route');
       require('ring-ui/components/tabs-ng/tabs-ng');
     </file>
   </example>
 */
const module = angular.module('Ring.tabs', ['ngRoute']);

module.directive('rgTabs', function ($location, $routeParams, $rootScope) {
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
      $scope.current = null;
      const idsMap = {};

      function getTabParameterName() {
        return $scope.tabParameter || 'tab';
      }

      function getCurrentTabId() {
        return $routeParams[getTabParameterName()];
      }

      function getCurrentTab() {
        const currentTabId = getCurrentTabId();
        if (currentTabId) {
          return idsMap[currentTabId];
        } else {
          return $scope.panes[0];
        }
      }

      function doSelect(newPane, skipUrlUpdate) {
        if (newPane === $scope.panes[$scope.current]) {
          return;
        }

        angular.forEach($scope.panes, (pane, index) => {
          // Update current tab
          if (pane === newPane || pane.tabId === newPane) {
            $scope.current = index;
            pane.selected = true;

            if (!skipUrlUpdate) {
              $location.search(getTabParameterName(), newPane.tabId);
            }
          } else { // Deselect all other
            pane.selected = false;
          }
        });
      }

      this.addPane = pane => {
        $scope.panes.push(pane);
        idsMap[pane.tabId] = pane;

        if ($scope.panes.length === 1 || pane.tabId === getCurrentTabId()) {
          doSelect(pane, true);
        }
      };

      $scope.$on('$destroy', $rootScope.$on('$routeUpdate', () => {
        doSelect(getCurrentTab(), true);
      }));

      // Exposed methods
      $scope.control = {};

      $scope.control.isLast = () => $scope.current === $scope.panes.length - 1;

      $scope.control.isFirst = () => $scope.current === 0;

      $scope.control.select = pane => {
        doSelect(pane, $scope.disableLocationChanging);
      };

      $scope.control.next = () => {
        let next = $scope.current + 1;
        if (next === $scope.panes.length) {
          next = $scope.panes.length - 1;
        }

        doSelect($scope.panes[next], $scope.disableLocationChanging);
      };

      $scope.control.prev = () => {
        let prev = $scope.current - 1;
        if (prev < 0) {
          prev = 0;
        }

        doSelect($scope.panes[prev], $scope.disableLocationChanging);
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

module.directive('rgTabsPane', function () {
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

export default module.name;
