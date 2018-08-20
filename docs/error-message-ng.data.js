window.source = {
  "title": "Error Message Ng",
  "url": "error-message-ng.html",
  "type": "js",
  "content": "import angular from 'angular';\n\nimport IconNG from '../icon-ng/icon-ng';\n\nimport '../error-message-ng/error-message-ng.scss';\n\n/**\n * @name Error Message Ng\n * @category Legacy Angular\n * @description Displays an error message.\n * @example\n  <example name=\"Error Message Ng\">\n    <file name=\"index.html\" disable-auto-size>\n      <div ng-app=\"ExampleApp\" ng-strict-di ng-controller=\"DemoCtrl\">\n        <rg-error-message code=\"Disconnected\" message=\"No, no one\\'s there.\" icon=\"{{errorIcon}}\" links=\"[{href:'.',text:'home'}]\">\n          Service backend isn't available\n        </rg-error-message>\n      </div>\n    </file>\n    <file name=\"index.js\">\n      import angular from 'angular';\n      import errorMessageNg from '@jetbrains/ring-ui/components/error-message-ng/error-message-ng';\n      import {FrownIcon} from '@jetbrains/ring-ui/components/icon';\n\n      angular.module('ExampleApp', [errorMessageNg]).\n        controller('DemoCtrl', function($scope) {\n          $scope.errorIcon = FrownIcon;\n        });\n     </file>\n  </example>\n */\n\nconst angularModule = angular.module('Ring.error-message', [IconNG]);\n\nangularModule.directive('rgErrorMessage', function rgErrorMessageDirective() {\n  return {\n    replace: true,\n    transclude: true,\n    template: require('./error-message-ng.html'),\n    restrict: 'E',\n\n    scope: {\n      code: '@',\n      message: '@',\n      links: '=',\n      icon: '@'\n    }\n  };\n});\n\nexport default angularModule.name;\n",
  "examples": [
    {
      "name": "Error Message Ng",
      "url": "examples/error-message-ng/error-message-ng.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<div ng-app=\"ExampleApp\" ng-strict-di ng-controller=\"DemoCtrl\">\n  <rg-error-message code=\"Disconnected\" message=\"No, no one\\'s there.\" icon=\"{{errorIcon}}\" links=\"[{href:'.',text:'home'}]\">\n    Service backend isn't available\n  </rg-error-message>\n</div>\n    ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport angular from 'angular';\nimport errorMessageNg from '@jetbrains/ring-ui/components/error-message-ng/error-message-ng';\nimport {FrownIcon} from '@jetbrains/ring-ui/components/icon';\n\nangular.module('ExampleApp', [errorMessageNg]).\n  controller('DemoCtrl', function($scope) {\n    $scope.errorIcon = FrownIcon;\n  });\n     ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Displays an error message.",
  "attrs": {
    "name": "Error Message Ng",
    "category": "Legacy Angular",
    "description": "Displays an error message.",
    "example": "  <example name=\"Error Message Ng\">\n    <file name=\"index.html\" disable-auto-size>\n      <div ng-app=\"ExampleApp\" ng-strict-di ng-controller=\"DemoCtrl\">\n        <rg-error-message code=\"Disconnected\" message=\"No, no one\\'s there.\" icon=\"{{errorIcon}}\" links=\"[{href:'.',text:'home'}]\">\n          Service backend isn't available\n        </rg-error-message>\n      </div>\n    </file>\n    <file name=\"index.js\">\n      import angular from 'angular';\n      import errorMessageNg from '@jetbrains/ring-ui/components/error-message-ng/error-message-ng';\n      import {FrownIcon} from '@jetbrains/ring-ui/components/icon';\n\n      angular.module('ExampleApp', [errorMessageNg]).\n        controller('DemoCtrl', function($scope) {\n          $scope.errorIcon = FrownIcon;\n        });\n     </file>\n  </example>"
  }
};