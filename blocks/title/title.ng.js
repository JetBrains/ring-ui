(function () {
  'use strict';
  var titleDelimiter = ' | ';

  var prependTitleElement = function($window, element, title) {
    var prevTitle = title || $window.document.title;

    $window.document.title = prevTitle ? element + titleDelimiter + prevTitle : element;
  };

  var replaceTitleElement = function($window, element, title) {
    var prevTitle = title || $window.document.title;
    var titleElements = prevTitle.split(titleDelimiter);
    titleElements[0] = element;

    $window.document.title = titleElements.join(titleDelimiter);
  };

  angular.module('Ring.title', []).
    directive('pageTitle', [function () {
      return {
        scope: {
          'pageTitle': '@pageTitle',
          'noTitle': '@noTitle',
          'delimiter': '@delimiter'
        },
        controller: ['$rootScope', '$scope', '$window', '$element', function ($rootScope, $scope, $window, $element) {
          if ($scope.delimiter) {
            titleDelimiter = $scope.delimiter;
          }

          // Get title prefix from title element
          $scope.base = $scope.pageTitle || $element.text();

          // Set page title on route change
          $rootScope.$on('$routeChangeSuccess', function (event, current) {
            var title = current.$$route && current.$$route.title;

            // Use title: false to prevent title change on route
            if (title !== false) {
              prependTitleElement($window, title || $scope.noTitle, $scope.base);
            }
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
        },
        'updateElement': function(element, fieldName) {
          if (fieldName) {
            replaceTitleElement($window, element[fieldName]);
          } else {
            replaceTitleElement($window, element);
          }
        }
      };
    }]);
})();