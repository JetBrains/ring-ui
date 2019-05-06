/**
 * @name Title Ng
 */
import angular from 'angular';

const angularModule = angular.module('Ring.title', []);

angularModule.directive('rgPageTitle', function rgPageTitleDirective() {
  return ({
    scope: {
      rgPageTitle: '@?',
      noTitle: '@?',
      delimiter: '@'
    },

    controller: function controller($rootScope, $scope, $element, $attrs, pageTitle, $injector) {
      const element = $element[0];

      // Get title prefix from title element
      const elementText = element.textContent;
      let offScopeWatch = angular.noop;

      // Set page title on route change
      const offRouteWatch = $rootScope.$on('$routeChangeSuccess', (event, current) => {
        //Do nothing if we're being redirected
        if (current.$$route && current.$$route.redirectTo) { // eslint-disable-line angular/no-private-call
          return;
        }
        let routeTitle = current.$$route && current.$$route.title; // eslint-disable-line angular/no-private-call

        pageTitle.setCurrent($scope.rgPageTitle || elementText);

        // Use title: false to prevent title change on route
        if (routeTitle !== false) {
          if (angular.isArray(routeTitle) || angular.isFunction(routeTitle)) {
            //Invoke injector
            routeTitle = $injector.invoke(routeTitle);
          }
          pageTitle.addElement(routeTitle || $scope.noTitle);
        }
      });

      $scope.$on('$destroy', () => {
        offRouteWatch();
        offScopeWatch();
      });

      this.$onInit = () => {
        pageTitle.setDelimiter($scope.delimiter);

        if ($attrs.rgPageTitle) {
          offScopeWatch = $scope.$watch('rgPageTitle', newBaseTitle => {
            pageTitle.setRootElement(newBaseTitle);
          });
        }
      };
    }
  });
});

angularModule.service('pageTitle', function service($interpolate, $document) {
  let delimiter = ' | ';
  let current = $document[0].title;

  function setTitle(text) {
    current = text && $interpolate(text)();
    updateDocumentTitle(current);
  }

  function updateDocumentTitle(text) {
    $document[0].title = text;
  }

  function prepend(element) {
    setTitle(current ? element + delimiter + current : element);
  }

  function replacePart(element, replaceIndex = 0) {
    const titleElements = current.split(delimiter);
    titleElements[replaceIndex === -1 ? titleElements.length - 1 : replaceIndex] = element;

    setTitle(titleElements.join(delimiter));
  }

  this.setDelimiter = newDelimiter => {
    delimiter = newDelimiter || delimiter;
  };

  this.setCurrent = newBase => {
    current = newBase;
  };

  this.setText = text => updateDocumentTitle(text);

  this.addElement = (element, fieldName) => {
    if (element.$promise) {
      element.$promise.then(Data => {
        this.addElement(Data[fieldName || 'name']);
      });
    } else {
      prepend(fieldName ? element[fieldName] : element);
    }
  };

  this.updateElement = (element, fieldName) => {
    if (element.$promise) {
      element.$promise.then(Data => {
        this.updateElement(Data[fieldName || 'name']);
      });
    } else {
      replacePart(fieldName ? element[fieldName] : element);
    }
  };

  this.setRootElement = element => {
    replacePart(element, -1);
  };
});

export default angularModule.name;
