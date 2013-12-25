(function () {
  'use strict';

  var queryAssist = ring('query-assist');

  angular.module('Ring.query-assist', [])
    .directive('queryAssist', [function () {
      return {
        restrict: 'E',
        scope: {
          query: '=query',
          dataSource: '=?source',
          search: '&onSearch',
          className: '@class'
        },
        link: {
          pre: function ($scope, iElement) {
            var APPLY_EVENT = 'apply::' + $scope.$id;

            // Apply search
            queryAssist.on(APPLY_EVENT, function (query) {
              $scope.query = query;
              $scope.$apply();
              $scope.search({query: query});
            });

            // Init
            queryAssist('init', {
              targetElem: iElement,
              className: $scope.className || null,
              method: 'replace',
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
              unWatchQuery();
            });
          }
        }
      };
    }]);
}());