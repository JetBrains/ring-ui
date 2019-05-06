import angular from 'angular';

import className from 'classnames';

import styles from '../tabs/tabs.css';
import Theme from '../global/theme';

/**
 * @name Tabs Ng
 */

const angularModule = angular.module('Ring.tabs', []);

angularModule.directive('rgTabs', function rgTabsDirective($location, $rootScope) {
  return {
    restrict: 'E',
    transclude: true,
    template: require('./tabs-ng.html'),
    replace: true,

    scope: {
      tabParameter: '@',
      tabsClass: '=',
      control: '=?',
      disableLocationChanging: '=',
      theme: '@?'
    },

    controller: function controller($scope) {
      $scope.panes = [];
      $scope.current = null;
      $scope.styles = styles;
      $scope.theme = $scope.theme || Theme.LIGHT;

      function getTabIdFromUrl() {
        return $location.search()[$scope.tabParameter];
      }

      function doSelect(newPane, skipUrlUpdate) {
        if (newPane === $scope.current || newPane.ngDisabled) {
          return;
        }

        for (let index = 0; index < $scope.panes.length; index++) {
          const pane = $scope.panes[index];

          // Update current tab
          if (pane === newPane || pane.tabId === newPane) {
            $scope.current = newPane;
            pane.selected = true;

            if (!skipUrlUpdate) {
              $location.search($scope.tabParameter, newPane.tabId);
            }
          } else { // Deselect all other
            pane.selected = false;
          }
        }
      }

      function getNextPaneIndex(reverseOrder) {
        const currentTabIndex = $scope.panes.indexOf($scope.current);
        let next = currentTabIndex;

        do {
          next += (reverseOrder ? -1 : 1);
        } while (next > -1 && next < $scope.panes.length && $scope.panes[next].ngDisabled);

        if (next >= $scope.panes.length) {
          next = $scope.panes.length - 1;
        } else if (next < 0) {
          next = 0;
        }

        // if no suitable tab found till the end of array
        if ($scope.panes[next].ngDisabled) {
          return currentTabIndex;
        }

        return next;
      }

      function getCurrentTab() {
        const currentTabId = getTabIdFromUrl();

        if (currentTabId) {
          const currentTab = $scope.panes.find(pane => pane.tabId === currentTabId);

          if (currentTab && !currentTab.ngDisabled) {
            return currentTab;
          } else {
            return $scope.panes[getNextPaneIndex()];
          }
        } else {
          return $scope.panes[0];
        }
      }

      // controller methods

      function checkCurrentTab() {
        if ($scope.panes.length) {
          doSelect(getCurrentTab(), true);
        }
      }

      this.addTab = tab => {
        $scope.panes.push(tab);

        if ($scope.panes.length === 1 || tab.tabId === getTabIdFromUrl()) {
          doSelect(tab, true);
        }
      };

      this.removeTab = tab => {
        const index = $scope.panes.indexOf(tab);

        $scope.panes.splice(index, 1);
        checkCurrentTab();
      };

      this.checkPane = checkCurrentTab;

      // scope

      $scope.$on('$destroy', $rootScope.$on('$routeUpdate', checkCurrentTab));

      // Exposed methods
      $scope.control = {};

      $scope.control.isLast =
        () => $scope.panes.indexOf($scope.current) === $scope.panes.length - 1;

      $scope.control.isFirst = () => $scope.panes.indexOf($scope.current) === 0;

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
      // I think this bug depends on the frequency of addTab calls (actually on digests)
      // and ng-class detection of added and removed classes becomes broken.
      // @maxim.erekhinskiy
      $scope.tabClass = pane => className(styles.title, {
        [styles.selected]: pane.selected
      });

      this.$onInit = () => {
        if (!$scope.tabParameter) {
          $scope.tabParameter = 'tab';
        }
      };
    }
  };
});

angularModule.directive('rgTabsPane', function rgTabsPaneDirective() {
  return {
    require: '^rgTabs',
    restrict: 'E',
    transclude: true,

    scope: {
      title: '@',
      counter: '@',
      tabId: '@?',
      tabIndex: '@?',
      selected: '=?',
      ngDisabled: '=?'
    },

    link: function link(scope, element, attrs, tabsCtrl) {
      scope.tabId = scope.tabId || scope.title.toLowerCase().replace(' ', '-');
      scope.tabIndex = scope.tabIndex ? +scope.tabIndex : 0;

      tabsCtrl.addTab(scope);

      scope.$on('$destroy', () => {
        tabsCtrl.removeTab(scope);
      });
    },

    template: '<div class="ring-tabs__content" ng-class="{\'ring-tabs__content_active\':selected}" ng-if="selected" ng-transclude></div>'
  };
});

export default angularModule.name;
