(function () {
  'use strict';

  angular.module('Ring.tabs', []).
    directive('ringTabs', ['$location', '$routeParams', function ($location, $routeParams) {
      return {
        restrict: 'E',
        transclude: true,
        scope: {
          tabParameter: '@',
          control: '=?'
        },
        controller: ['$scope', '$attrs', function ($scope, $attrs) {
          $scope.panes = [];
          $scope.current = 0;

          if ('pointer' in $attrs) {
            $scope.pointer = true;
          }

          var doSelect = function (newPane, skipUrlUpdate) {
            if (typeof newPane === 'number') {
              var panes = $scope.panes.length - 1;

              if (newPane > panes) {
                newPane = panes;
              } else if (newPane < 0) {
                newPane = 0;
              }

              newPane = $scope.panes[newPane];
            }

            angular.forEach($scope.panes, function (pane, index) {
              // Update current tab
              if (pane === newPane) {
                $scope.current = index;
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
          };

          var getTabParameterName = function () {
            return $scope.tabParameter || 'tab';
          };

          var selectedTab = $routeParams[getTabParameterName()];

          this.addPane = function (pane) {
            if ($scope.panes.length === 0 || pane.tabId === selectedTab) {
              doSelect(pane, true);
              $scope.current = $scope.panes.length;
            }
            $scope.panes.push(pane);
          };

          // Exposed methods
          $scope.control = {};

          $scope.control.isLast = function() {
            return $scope.current === $scope.panes.length - 1;
          };

          $scope.control.isFirst = function() {
            return $scope.current === 0;
          };

          $scope.control.select = function (pane) {
            doSelect(pane);
          };

          $scope.control.next = function () {
            doSelect($scope.current + 1);
          };

          $scope.control.prev = function () {
            doSelect($scope.current - 1);
          };
        }],
        templateUrl: 'tabs/tabs.ng.html',
        replace: true
      };
    }]).
    directive('ringTabsPane', function () {
      return {
        require: '^ringTabs',
        restrict: 'E',
        transclude: true,
        scope: { title: '@' },
        link: function (scope, element, attrs, tabsCtrl) {
          scope.tabId = attrs.tabId || scope.title.toLowerCase();
          tabsCtrl.addPane(scope);
        },
        templateUrl: 'tabs/tabs__pane.ng.html',
        replace: true
      };
    });
}());
