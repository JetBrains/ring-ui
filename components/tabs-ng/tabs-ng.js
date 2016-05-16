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

module.directive('rgTabs', ($location, $routeParams, $rootScope) => ({
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

    function getTabIdFromUrl() {
      return $routeParams[getTabParameterName()];
    }

    function doSelect(newPane, skipUrlUpdate) {

      if (newPane === $scope.panes[$scope.current]) {
        return;
      }

      for (let index = 0; index < $scope.panes.length; index++) {
        const pane = $scope.panes[index];

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
      }
    }

    this.addPane = pane => {
      $scope.panes.push(pane);
      idsMap[pane.tabId] = pane;

      if ($scope.panes.length === 1 || pane.tabId === getTabIdFromUrl()) {
        doSelect(pane, true);
      }
    };

    function getCurrentTab() {
      const currentTabId = getTabIdFromUrl();
      if (currentTabId) {
        return idsMap[currentTabId];
      } else {
        return $scope.panes[0];
      }
    }

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

    // for some reason ng-class doesnt work properly on tabs
    // from time to time several tabs looks like selected despite correct scope state
    // i think this bug depends on the speed of addPane calls (actually on digests)
    // and ng-class detection of added and removed classes becomes broken
    // @maxim.erekhinskiy
    $scope.tabClass = pane => {
      let classes = 'ring-tabs__btn';

      if (pane.selected) {
        classes += ' active';
      }

      if ($scope.focus && pane.selected) {
        classes += ' ring-tabs__btn_focus';
      }

      return classes;
    };

  }],

  template: require('./tabs-ng.html'),
  replace: true
}));

module.directive('rgTabsPane', () => ({
  require: '^rgTabs',
  restrict: 'E',
  transclude: true,

  scope: {
    tabId: '@',
    title: '@',
    counter: '@',
    selected: '=?'
  },

  link(scope, element, attrs, tabsCtrl) {
    scope.tabId = scope.tabId || scope.title.toLowerCase();
    tabsCtrl.addPane(scope);
  },

  template: '<div class="ring-tabs__content" ng-class="{\'ring-tabs__content_active\':selected}" ng-if="selected" ng-transclude></div>'
}));

export default module.name;
