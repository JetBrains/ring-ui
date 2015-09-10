/* global angular: false */

angular.module('Ring.title', []).
  directive('rgPageTitle', function () {
    return {
      scope: {
        'rgPageTitle': '@',
        'noTitle': '@',
        'delimiter': '@'
      },
      controller: function ($rootScope, $scope, $element, pageTitle, $injector) {
        pageTitle.setDelimiter($scope.delimiter);

        // Get title prefix from title element
        var elementText = $element.text();

        // Set page title on route change
        $rootScope.$on('$routeChangeSuccess', function (event, current) {
          var title = current.$$route && current.$$route.title;

          pageTitle.setCurrent($scope.rgPageTitle || elementText);

          // Use title: false to prevent title change on route
          if (title !== false) {
            if (angular.isArray(title) || angular.isFunction(title)) {
              //Invoke injector
              title = $injector.invoke(title);
            }
            pageTitle.addElement(title || $scope.noTitle);
          }
        });
      }
    };
  }).
  service('pageTitle', function ($window, $interpolate) {
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
    var self = this;

    this.setDelimiter = function (newDelimiter) {
      delimiter = newDelimiter || delimiter;
    };

    this.setCurrent = function (newBase) {
      current = newBase;
    };

    this.addElement = function (element, fieldName) {
      if (element.$promise) {
        element.$promise.then(function (Data) {
          self.addElement(Data[fieldName || 'name']);
        });
      } else {
        prepend(fieldName ? element[fieldName] : element);
      }
    };

    this.updateElement = function (element, fieldName) {
      if (element.$promise) {
        element.$promise.then(function (Data) {
          self.updateElement(Data[fieldName || 'name']);
        });
      } else {
        replaceFirst(fieldName ? element[fieldName] : element);
      }
    };

  });
