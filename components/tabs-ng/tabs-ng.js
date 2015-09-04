/* global angular: false */

require('../tabs/tabs.scss');

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

   <example name="Tabs-ng with custom title content">
     <file name="index.html">
     <div ng-app="Ring.tabs">
       <rg-tabs class="container container_tabs">
          <rg-tabs-pane-title for-tab-id="do-not-forget-id">Here is <i>custom</i> tab's <b>title</b></rg-tabs-pane-title>
          <rg-tabs-pane x-title="foo" tab-id="do-not-forget-id">Tab content</rg-tabs-pane>
          <rg-tabs-pane x-title="Usual tab" counter="666">usual tab content</rg-tabs-pane>
       </rg-tabs>
     </div>
     </file>
     <file name="index.js" webpack="true">
       require('angular/angular.min.js');
       require('angular-route/angular-route.min.js');
       require('tabs-ng/tabs-ng');
     </file>
   </example>

    <example name="Tabs-ng with many tabs">
     <file name="index.html">
     <div ng-app="Ring.tabs">
       <rg-tabs class="container container_tabs">
         <rg-tabs-pane x-title="Tab with very very long name 1">content 1</rg-tabs-pane>
         <rg-tabs-pane x-title="Tab with very very long name 2">content 2</rg-tabs-pane>
         <rg-tabs-pane x-title="Tab with very very long name 3">content 3</rg-tabs-pane>
         <rg-tabs-pane x-title="Tab with very very long name 1">content 1</rg-tabs-pane>
         <rg-tabs-pane x-title="Tab with very very long name 4">content 4</rg-tabs-pane>
         <rg-tabs-pane x-title="Tab with very very long name 5">content 5</rg-tabs-pane>
         <rg-tabs-pane x-title="Tab with very very long name 6">content 6</rg-tabs-pane>
         <rg-tabs-pane x-title="Tab with very very long name 7">content 7</rg-tabs-pane>
         <rg-tabs-pane x-title="Tab with very very long name 8">content 8</rg-tabs-pane>
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

angular.module('Ring.tabs', ['ngRoute']).
  directive('rgTabs', ['$location', '$routeParams', '$rootScope', function ($location, $routeParams, $rootScope) {
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

        var getTabParameterName = function () {
          return $scope.tabParameter || 'tab';
        };

        var doSelect = function (newPane, skipUrlUpdate) {
          if (newPane === $scope.panes[$scope.current]) {
            return;
          }

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
        };

        this.addPane = function (pane) {
          if ($scope.panes.length === 0 || pane.tabId === $routeParams[getTabParameterName()]) {
            doSelect(pane, true);
            $scope.current = $scope.panes.length;
          }
          $scope.panes.push(pane);
        };

        $rootScope.$on('$routeUpdate', function() {
          doSelect($routeParams[getTabParameterName()] || 0, true);
        });

        // Exposed methods
        $scope.control = {};

        $scope.control.isLast = function() {
          return $scope.current === $scope.panes.length - 1;
        };

        $scope.control.isFirst = function() {
          return $scope.current === 0;
        };

        $scope.control.select = function (pane) {
          doSelect(pane, $scope.disableLocationChanging);
        };

        $scope.control.next = function () {
          doSelect($scope.current + 1, $scope.disableLocationChanging);
        };

        $scope.control.prev = function () {
          doSelect($scope.current - 1, $scope.disableLocationChanging);
        };

        $scope.keyMap = {
          next: $scope.control.next,
          prev: $scope.control.prev,
          focus: function() {
            $scope.focus = !$scope.focus;
            return !$scope.focus;
          }
        };

      }],
      template: require('./tabs-ng.html'),
      replace: true
    };
  }])
  .directive('rgTabsTabTitle', function () {
    return {
      template: '<span>{{pane.title}}</span>',
      replace: true,
      scope: {
        pane: '='
      },
      link: function (scope, iElement) {
        var angularElement = angular.element(iElement[0]);

        if (scope.pane.customTabTitleElement) {
          angularElement.replaceWith(scope.pane.customTabTitleElement);
          //Delete link to DOM node to avoid potentially detached node link storing
          delete scope.pane.customTabTitleElement;
        }
      }
    };
  })
  .directive('rgTabsPane', function () {
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

        scope.customTabTitleElement = element[0].parentNode.querySelector('[for-tab-id="' + scope.tabId + '"]');

        tabsCtrl.addPane(scope);
      },
      template: '<div class="ring-tabs__content" ng-class="{\'ring-tabs__content_active\':selected}" ng-if="selected" ng-transclude></div>'
    };
  })
  .directive('rgTabsScrollHandler', function () {
    return {
      restrict: 'A',
      link: function (scope, iElement) {
        var element = iElement[0];
        var currentLeft = null;

        element.addEventListener('mousewheel', function (e) {
          var elementWidth = element.offsetWidth;
          var elementScrollableWidth = element.scrollWidth;
          var newLeft = currentLeft + e.wheelDeltaX;

          if (newLeft >= 0) {
            newLeft = 0;
          }
          if (newLeft <= elementWidth - elementScrollableWidth) {
            newLeft = elementWidth - elementScrollableWidth;
          }

          currentLeft = newLeft;
          element.style.left = newLeft + 'px';
        });
      }
    };
  });
