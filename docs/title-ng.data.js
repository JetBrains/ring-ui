window.source = {
  "title": "Title Ng",
  "url": "title-ng.html",
  "type": "js",
  "content": "/**\n * @name Title Ng\n * @category Legacy Angular\n * @tags Ring UI Language\n * @description A component for manipulating page title.\n * @example\n   <example name=\"Title Ng\">\n    <file name=\"index.html\">\n      <div ng-app=\"test\">\n        <h4>Open the example in a separate tab to see how tab title changes.</h4>\n\n        <!--It is better to use this directive with <title> tag in your <head> section.-->\n        <div rg-page-title=\"App name\"></rg-page-title>\n      </div>\n    </file>\n    <file name=\"index.js\">\n      import angular from 'angular';\n      import TitleNg from '@jetbrains/ring-ui/components/title-ng/title-ng';\n\n      angular.module('test', [TitleNg]).\n        run(function (pageTitle) {\n          pageTitle.addElement('Some page');\n        });\n    </file>\n   </example>\n */\nimport angular from 'angular';\n\nconst angularModule = angular.module('Ring.title', []);\n\nangularModule.directive('rgPageTitle', function rgPageTitleDirective() {\n  return ({\n    scope: {\n      rgPageTitle: '@?',\n      noTitle: '@?',\n      delimiter: '@'\n    },\n\n    controller: function controller($rootScope, $scope, $element, $attrs, pageTitle, $injector) {\n      const element = $element[0];\n\n      // Get title prefix from title element\n      const elementText = element.textContent;\n      let offScopeWatch = angular.noop;\n\n      // Set page title on route change\n      const offRouteWatch = $rootScope.$on('$routeChangeSuccess', (event, current) => {\n        //Do nothing if we're being redirected\n        if (current.$$route && current.$$route.redirectTo) { // eslint-disable-line angular/no-private-call\n          return;\n        }\n        let routeTitle = current.$$route && current.$$route.title; // eslint-disable-line angular/no-private-call\n\n        pageTitle.setCurrent($scope.rgPageTitle || elementText);\n\n        // Use title: false to prevent title change on route\n        if (routeTitle !== false) {\n          if (angular.isArray(routeTitle) || angular.isFunction(routeTitle)) {\n            //Invoke injector\n            routeTitle = $injector.invoke(routeTitle);\n          }\n          pageTitle.addElement(routeTitle || $scope.noTitle);\n        }\n      });\n\n      $scope.$on('$destroy', () => {\n        offRouteWatch();\n        offScopeWatch();\n      });\n\n      this.$onInit = () => {\n        pageTitle.setDelimiter($scope.delimiter);\n\n        if ($attrs.rgPageTitle) {\n          offScopeWatch = $scope.$watch('rgPageTitle', newBaseTitle => {\n            pageTitle.setRootElement(newBaseTitle);\n          });\n        }\n      };\n    }\n  });\n});\n\nangularModule.service('pageTitle', function service($interpolate, $document) {\n  let delimiter = ' | ';\n  let current = $document[0].title;\n\n  function setTitle(text) {\n    current = text && $interpolate(text)();\n    updateDocumentTitle(current);\n  }\n\n  function updateDocumentTitle(text) {\n    $document[0].title = text;\n  }\n\n  function prepend(element) {\n    setTitle(current ? element + delimiter + current : element);\n  }\n\n  function replacePart(element, replaceIndex = 0) {\n    const titleElements = current.split(delimiter);\n    titleElements[replaceIndex === -1 ? titleElements.length - 1 : replaceIndex] = element;\n\n    setTitle(titleElements.join(delimiter));\n  }\n\n  this.setDelimiter = newDelimiter => {\n    delimiter = newDelimiter || delimiter;\n  };\n\n  this.setCurrent = newBase => {\n    current = newBase;\n  };\n\n  this.setText = text => updateDocumentTitle(text);\n\n  this.addElement = (element, fieldName) => {\n    if (element.$promise) {\n      element.$promise.then(Data => {\n        this.addElement(Data[fieldName || 'name']);\n      });\n    } else {\n      prepend(fieldName ? element[fieldName] : element);\n    }\n  };\n\n  this.updateElement = (element, fieldName) => {\n    if (element.$promise) {\n      element.$promise.then(Data => {\n        this.updateElement(Data[fieldName || 'name']);\n      });\n    } else {\n      replacePart(fieldName ? element[fieldName] : element);\n    }\n  };\n\n  this.setRootElement = element => {\n    replacePart(element, -1);\n  };\n});\n\nexport default angularModule.name;\n",
  "examples": [
    {
      "name": "Title Ng",
      "url": "examples/title-ng/title-ng.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div ng-app=\"test\">\n  <h4>Open the example in a separate tab to see how tab title changes.</h4>\n\n  <!--It is better to use this directive with <title> tag in your <head> section.-->\n  <div rg-page-title=\"App name\"></rg-page-title>\n</div>\n    ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport angular from 'angular';\nimport TitleNg from '@jetbrains/ring-ui/components/title-ng/title-ng';\n\nangular.module('test', [TitleNg]).\n  run(function (pageTitle) {\n    pageTitle.addElement('Some page');\n  });\n    ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "A component for manipulating page title.",
  "attrs": {
    "name": "Title Ng",
    "category": "Legacy Angular",
    "tags": "Ring UI Language",
    "description": "A component for manipulating page title.",
    "example": "   <example name=\"Title Ng\">\n    <file name=\"index.html\">\n      <div ng-app=\"test\">\n        <h4>Open the example in a separate tab to see how tab title changes.</h4>\n\n        <!--It is better to use this directive with <title> tag in your <head> section.-->\n        <div rg-page-title=\"App name\"></rg-page-title>\n      </div>\n    </file>\n    <file name=\"index.js\">\n      import angular from 'angular';\n      import TitleNg from '@jetbrains/ring-ui/components/title-ng/title-ng';\n\n      angular.module('test', [TitleNg]).\n        run(function (pageTitle) {\n          pageTitle.addElement('Some page');\n        });\n    </file>\n   </example>"
  }
};