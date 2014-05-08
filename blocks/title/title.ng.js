(function () {
  'use strict';

  angular.module('Ring.title', []).
    directive('pageTitle', [function () {
      return {
        scope: {
          'pageTitle': '@',
          'noTitle': '@',
          'delimiter': '@'
        },
        controller: ['$rootScope', '$scope', '$window', '$element', 'pageTitle', function ($rootScope, $scope, $window, $element, pageTitle) {
          pageTitle.setDelimiter($scope.delimiter);

          // Get title prefix from title element
          var elementText = $element.text();

          // Set page title on route change
          $rootScope.$on('$routeChangeSuccess', function (event, current) {
            var title = current.$$route && current.$$route.title;

            pageTitle.setCurrent($scope.pageTitle || elementText);

            // Use title: false to prevent title change on route
            if (title !== false) {
              pageTitle.addElement(title || $scope.noTitle);
            }
          });
        }]
      };
    }]).
    service('pageTitle', ['$window', '$interpolate', function ($window, $interpolate) {
      var delimiter = ' | ';
      var current = $window.document.title;

      var setTitle = function (text) {
        current = text && $interpolate(text)();
        $window.document.title = current;
      };

      var prepend = function (element) {
        setTitle(current ? element + delimiter + current : element);
      };

      var replaceFirst = function (element) {
        var titleElements = current.split(delimiter);
        titleElements[0] = element;

        setTitle(titleElements.join(delimiter));
      };
      var it = this;

      this.setDelimiter = function (newDelimiter) {
        delimiter = newDelimiter || delimiter;
      };

      this.setCurrent = function (newBase) {
        current = newBase || current;
      };

      this.addElement = function (element, fieldName) {
        if (element.$promise) {
          element.$promise.then(function (Data) {
            it.addElement(Data[fieldName || 'name']);
          });
        } else {
          prepend(fieldName ? element[fieldName] : element);
        }
      };

      this.updateElement = function (element, fieldName) {
        if (element.$promise) {
          element.$promise.then(function (Data) {
            it.updateElement(Data[fieldName || 'name']);
          });
        } else {
          replaceFirst(fieldName ? element[fieldName] : element);
        }
      };

    }]);
})();