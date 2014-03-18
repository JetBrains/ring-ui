(function () {
  'use strict';

  var queryAssist = ring('query-assist');

  angular.module('Ring.query-assist', [])
    .directive('queryAssist', [function () {
      return {
        restrict: 'E',
        scope: {
          query: '=query',
          focus: '=focus',
          dataSource: '=?source',
          search: '&onSearch',
          tabIndex: '@tabIndex',
          className: '@class',
          placeholder: '@'
        },
        link: {
          pre: function ($scope, iElement, iAttrs) {
            var APPLY_EVENT  = 'apply::' + $scope.$id;
            var CHANGE_EVENT = 'change::' + $scope.$id;
            var FOCUS_CHANGE_EVENT = 'focus-change::' + $scope.$id;

            // Apply search
            queryAssist.on(APPLY_EVENT, function (query) {
              $scope.query = query;
              $scope.$apply();
              $scope.search({query: query});
            });

            queryAssist.on(CHANGE_EVENT, function (data) {
              $scope.query = data.value;
              $scope.$apply();
            });

            queryAssist.on(FOCUS_CHANGE_EVENT, function (data) {
              $scope.focus = data;
              if (!$scope.$root.$$phase) {
                $scope.$apply();
              }
            });

            var unWatchFocus = $scope.$watch('focus', function(value) {
              queryAssist.trigger('focus', value);
            });

            // Init
            queryAssist('init', {
              targetElem: iElement,
              className: $scope.className || null,
              tabIndex: $scope.tabIndex || null,
              placeholder: $scope.placeholder,
              method: 'replace',
              glass: 'glass' in iAttrs,
              query: $scope.query || '',
              dataSource: $scope.dataSource
            });

            // Update query from url on init
            var unWatchQuery = angular.noop;
            if (!$scope.query) {
              unWatchQuery = $scope.$watch('query', function(query) {
                queryAssist('updateQuery', query);
                unWatchQuery();
              });
            }

            // Proerly destroy scope
            $scope.$on('$destroy', function() {
              queryAssist.off(APPLY_EVENT);
              queryAssist.off(CHANGE_EVENT);
              queryAssist.off(FOCUS_CHANGE_EVENT);
              unWatchQuery();
              unWatchFocus();
            });
          }
        }
      };
    }]);
}());