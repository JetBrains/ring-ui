(function () {
  'use strict';

  var prependTitleElement = function($window, element, title) {
    var prevTitle = title || $window.document.title;

    $window.document.title = prevTitle ? element + ' | ' + prevTitle : element;
  };

  angular.module('Ring.title', []).
    directive('pageTitle', [function () {
      return {
        scope: {
          'pageTitle': '@pageTitle',
          'noTitle': '@noTitle'
        },
        controller: ['$rootScope', '$scope', '$window', '$element', function ($rootScope, $scope, $window, $element) {
          // Get title prefix from title element
          $scope.base = $scope.pageTitle || $element.text();

          // Set page title on route change
          $rootScope.$on('$routeChangeSuccess', function (event, current) {
            var title = current.$$route && current.$$route.title || $scope.noTitle;

            prependTitleElement($window, title, $scope.base);
          });
        }]
      };
    }]).
    service('pageTitle', ['$window', function ($window) {
      return {
        'addElement': function (element, fieldName) {
          if (element.$promise) {
            element.$promise.then(function(Data) {
              prependTitleElement($window, Data[fieldName || 'name']);
            });
          } else if (fieldName) {
            prependTitleElement($window, element[fieldName]);
          } else {
            prependTitleElement($window, element);
          }
        }
      };
    }]);
})();