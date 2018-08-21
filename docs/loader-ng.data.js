window.source = {
  "title": "Loader Ng",
  "url": "loader-ng.html",
  "type": "js",
  "content": "import angular from 'angular';\n\nimport RingAngularComponent from '../global/ring-angular-component';\nimport LoaderCore from '../loader/loader__core';\n\n/**\n * @name Loader Ng\n * @category Legacy Angular\n * @tags Ring UI Language\n * @framework Angular\n * @constructor\n * @description Displays the loader.\n * @example\n    <example name=\"Loader Ng\">\n      <file name=\"index.html\">\n        <div id=\"loader\" ng-app=\"TestApp\" ng-strict-di ng-controller=\"TestCtrl as testCtrl\">\n          <rg-loader message=\"{{testCtrl.message}}\"></rg-loader>\n        </div>\n      </file>\n      <file name=\"index.js\">\n        import angular from 'angular';\n        import Loader from  '@jetbrains/ring-ui/components/loader-ng/loader-ng';\n\n        angular.module('TestApp', [Loader]).\n          controller('TestCtrl', function () {\n            this.message = 'Loading...';\n          })\n      </file>\n  </example>\n */\n\n\nconst angularModule = angular.module('Ring.loader', []);\n\nclass RgLoaderComponent extends RingAngularComponent {\n  static $inject = ['$element'];\n\n  static bindings = {\n    message: '@'\n  };\n\n  constructor(...args) {\n    super(...args);\n    const {$element} = this.$inject;\n    this.loader = new LoaderCore($element[0], {message: this.message});\n  }\n\n  $onDestroy() {\n    this.loader.destroy();\n  }\n\n  $onChanges(changes) {\n    this.loader.updateMessage(changes.message.currentValue);\n  }\n}\n\nangularModule.component('rgLoader', RgLoaderComponent);\n\nexport default angularModule.name;\n",
  "examples": [
    {
      "name": "Loader Ng",
      "url": "examples/loader-ng/loader-ng.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"loader\" ng-app=\"TestApp\" ng-strict-di ng-controller=\"TestCtrl as testCtrl\">\n  <rg-loader message=\"{{testCtrl.message}}\"></rg-loader>\n</div>\n      ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport angular from 'angular';\nimport Loader from  '@jetbrains/ring-ui/components/loader-ng/loader-ng';\n\nangular.module('TestApp', [Loader]).\n  controller('TestCtrl', function () {\n    this.message = 'Loading...';\n  })\n      ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Displays the loader.",
  "attrs": {
    "name": "Loader Ng",
    "category": "Legacy Angular",
    "tags": "Ring UI Language",
    "framework": "Angular",
    "constructor": "",
    "description": "Displays the loader.",
    "example": "    <example name=\"Loader Ng\">\n      <file name=\"index.html\">\n        <div id=\"loader\" ng-app=\"TestApp\" ng-strict-di ng-controller=\"TestCtrl as testCtrl\">\n          <rg-loader message=\"{{testCtrl.message}}\"></rg-loader>\n        </div>\n      </file>\n      <file name=\"index.js\">\n        import angular from 'angular';\n        import Loader from  '@jetbrains/ring-ui/components/loader-ng/loader-ng';\n\n        angular.module('TestApp', [Loader]).\n          controller('TestCtrl', function () {\n            this.message = 'Loading...';\n          })\n      </file>\n  </example>"
  }
};