(function () {
  'use strict';

  angular.module('Ring.tabs', []).
    directive('ringTabs', ['$location', '$routeParams', function ($location, $routeParams) {
      return {
        restrict: 'E',
        transclude: true,
        scope: {
          tabParameter: '@',
          control: '='
        },
        controller: ['$scope', function ($scope) {
          $scope.panes = [];

          var deselectAll = function() {
            var current = 0;

            angular.forEach($scope.panes, function (pane, index) {
              if (pane.selected) {
                current = index;
                pane.selected = false;
              }
            });

            return current;
          };

          var doSelect = function (pane) {
            pane.selected = true;
          };

          var getTabParameterName = function () {
            return $scope.tabParameter || 'tab';
          };

          var updateUrl = function(pane) {
            $location.search(getTabParameterName(), pane.tabId);
          };

          var selectedTab = $routeParams[getTabParameterName()];

          // Exposed methods
          $scope.control = {};

          $scope.control.select = function (pane) {
            deselectAll();
            doSelect(pane);
            updateUrl(pane);
          };

          $scope.control.next = function () {
            var next = deselectAll() + 1;
            var panes = $scope.panes.length - 1;

            var pane = $scope.panes[next > panes ? panes : next];
            pane.selected = true;
            updateUrl(pane);
          };

          $scope.control.prev = function () {
            var prev = deselectAll() - 1;

            var pane = $scope.panes[prev < 0 ? 0 : prev];
            pane.selected = true;
            updateUrl(pane);
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
