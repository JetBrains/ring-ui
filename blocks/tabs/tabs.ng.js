(function () {
  'use strict';

  angular.module('Ring.tabs', []).
    directive('ringTabs', ['$location', '$routeParams', function ($location, $routeParams) {
      return {
        restrict: 'E',
        transclude: true,
        scope: { tabParameter: '@'},
        controller: ['$scope', function ($scope) {
          $scope.panes = [];
          var doSelect = function (pane) {
              angular.forEach($scope.panes, function (pane) {
                pane.selected = false;
              });
              pane.selected = true;
            },
            getTabParameterName = function () {
              return $scope.tabParameter || 'tab';
            },
            selectedTab = $routeParams[getTabParameterName()];

          $scope.select = function (pane) {
            $location.search(getTabParameterName(), pane.tabId);
            doSelect(pane);
          };

          this.addPane = function (pane) {
            if ($scope.panes.length === 0 || pane.tabId === selectedTab) {
              doSelect(pane);
            }
            $scope.panes.push(pane);
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
