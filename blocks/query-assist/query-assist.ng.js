(function () {
  'use strict';

  var QueryAssist = ring('query-assist')('getQueryAssist');

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
          listenDelay: '@',
          placeholder: '@'
        },
        link: {
          pre: function ($scope, iElement, iAttrs) {
            // Apply search
            function onApply(query) {
              $scope.query = query;
              $scope.$apply();
              $scope.search({query: query});
            }

            function onChange(query) {
              $scope.query = query;
              $scope.$apply();
            }

            function onFocusChange(focus) {
              $scope.focus = !!focus;
              if (!$scope.$root.$$phase) {
                $scope.$apply();
              }
            }

            // Init
            var queryAssist = new QueryAssist({
              targetElem: iElement,
              autofocus: true,
              className: $scope.className || null,
              tabIndex: $scope.tabIndex || null,
              placeholder: $scope.placeholder,
              method: 'replace',
              glass: 'glass' in iAttrs,
              query: $scope.query || '',
              listenDelay: $scope.listenDelay,
              dataSource: $scope.dataSource,
              onFocusChange: onFocusChange,
              onChange: onChange,
              onApply: onApply
            });

            $scope.$watch('focus', function(value) {
              queryAssist.setFocus(value);
            });

            $scope.$watch('query', function(query) {
              queryAssist.updateQuery({query: query});
              queryAssist.setFocus(!!$scope.focus);
            });

            iElement.on('$destroy', function() {
              queryAssist.destroy();
            });
          }
        }
      };
    }]);
}());