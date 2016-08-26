import '../tabs/tabs.scss';

/**
 * @name Tabs Ng
 * @category Angular Components
 * @description Displays a tab set.
 * @example
   <example name="Tabs Ng">
     <file name="index.html">
       <div ng-app="Ring.tabs">
         <rg-tabs class="container container_tabs">
           <rg-tabs-pane x-title="Settings">Settings tab content</rg-tabs-pane>
           <rg-tabs-pane x-title="Access" counter="7">Access tab content</rg-tabs-pane>
           <rg-tabs-pane x-title="Disabled" ng-disabled="true" counter="8">Inaccessible tab content</rg-tabs-pane>
           <rg-tabs-pane x-title="Members">Members tab content</rg-tabs-pane>
           <rg-tabs-pane x-title="Members" counter="666">Members 666 tab content</rg-tabs-pane>
         </rg-tabs>
       </div>
     </file>
     <file name="index.js" webpack="true">
       require('angular');
       require('ring-ui/components/tabs-ng/tabs-ng');
     </file>
   </example>
 */
/* global angular: false */
const angularModule = angular.module('Ring.tabs', []);

angularModule.directive('rgTabs', ($location, $rootScope) => ({
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
      return $location.search()[getTabParameterName()];
    }

    function doSelect(newPane, skipUrlUpdate) {

      if (newPane === $scope.panes[$scope.current] || newPane.ngDisabled) {
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

    function getNextPaneIndex(reverseOrder) {
      let next = $scope.current;

      do {
        next += (reverseOrder ? -1 : 1);
      } while ($scope.panes[next].ngDisabled && next > -1 && next < $scope.panes.length);

      if (next >= $scope.panes.length) {
        next = $scope.panes.length - 1;
      }
      if (next < 0) {
        next = 0;
      }
      if ($scope.panes[next].ngDisabled) {
        return $scope.current;
      }
      return next;
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
      const next = getNextPaneIndex();
      doSelect($scope.panes[next], $scope.disableLocationChanging);
    };

    $scope.control.prev = () => {
      const prev = getNextPaneIndex(true);
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

    // For some reason ng-class doesn't work properly on tabs.
    // From time to time several tabs look like selected despite correct scope state.
    // I think this bug depends on the frequency of addPane calls (actually on digests)
    // and ng-class detection of added and removed classes becomes broken.
    // @maxim.erekhinskiy
    $scope.tabClass = pane => {
      let classes = 'ring-tabs__btn';

      if (pane.ngDisabled) {
        classes += ' ring-tabs__btn_disabled';
      } else if (pane.selected) {
        classes += ' active';

        if ($scope.focus) {
          classes += ' ring-tabs__btn_focus';
        }
      }

      return classes;
    };

  }],

  template: require('./tabs-ng.html'),
  replace: true
}));

angularModule.directive('rgTabsPane', () => ({
  require: '^rgTabs',
  restrict: 'E',
  transclude: true,

  scope: {
    tabId: '@',
    title: '@',
    counter: '@',
    selected: '=?',
    ngDisabled: '=?'
  },

  link(scope, element, attrs, tabsCtrl) {
    scope.tabId = scope.tabId || scope.title.toLowerCase();
    tabsCtrl.addPane(scope);
  },

  template: '<div class="ring-tabs__content" ng-class="{\'ring-tabs__content_active\':selected}" ng-if="selected" ng-transclude></div>'
}));

export default angularModule.name;
