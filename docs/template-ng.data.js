window.source = {
  "title": "Template Ng",
  "url": "template-ng.html",
  "type": "js",
  "content": "import angular from 'angular';\n\nimport RingAngularComponent from '../global/ring-angular-component';\n\n/**\n * @name Template Ng\n * @category Legacy Angular\n * @tags Ring UI Language\n * @example\n    <example name=\"Template Ng\">\n      <file name=\"index.html\">\n        <div ng-app=\"Example.template-ng\" ng-strict-di>\n          <rg-template template=\"'<input/>'\"></rg-template>\n        </div>\n      </file>\n      <file name=\"index.js\" webpack=\"true\">\n        import angular from 'angular';\n        import '@jetbrains/ring-ui/components/template-ng/template-ng';\n\n        angular\n        .module('Example.template-ng', ['Ring.template']);\n      </file>\n    </example>\n\n    <example name=\"Template Ng #2\">\n      <file name=\"index.html\">\n        <div ng-app=\"Example.template-ng\" ng-strict-di>\n          <rg-template template=\"template\" ng-controller=\"ExampleCtrl\"></rg-template>\n        </div>\n      </file>\n      <file name=\"index.js\" webpack=\"true\">\n        import angular from 'angular';\n        import TemplateNG from '@jetbrains/ring-ui/components/template-ng/template-ng';\n\n        angular\n        .module('Example.template-ng', [TemplateNG])\n        .controller('ExampleCtrl', function ($scope) {\n          $scope.template = '<button>button</button>';\n        });\n      </file>\n    </example>\n*/\n\nconst angularModule = angular.module('Ring.template', []);\n\nclass RgTemplateController extends RingAngularComponent {\n  static $inject = ['$scope', '$element', '$attrs', '$compile'];\n\n  currentScope = null;\n\n  constructor(...args) {\n    super(...args);\n\n    const {$scope, $attrs} = this.$inject;\n    $scope.$watch($attrs.rgTemplate || $attrs.template, this.render);\n  }\n\n  render = template => {\n    const {$scope, $element, $compile} = this.$inject;\n\n    this.cleanup();\n\n    this.currentScope = $scope.$new();\n\n    this.currentScope.$evalAsync(() => {\n      $element.html(template);\n      $compile($element.contents())(this.currentScope);\n    });\n  };\n\n  cleanup() {\n    if (this.currentScope) {\n      this.currentScope.$destroy();\n      this.currentScope = null;\n    }\n  }\n}\n\nangularModule.directive('rgTemplate', function rgTemplateDirective() {\n  return {\n    controller: RgTemplateController\n  };\n});\n\nexport default angularModule.name;\n",
  "examples": [
    {
      "name": "Template Ng",
      "url": "examples/template-ng/template-ng.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div ng-app=\"Example.template-ng\" ng-strict-di>\n  <rg-template template=\"'<input/>'\"></rg-template>\n</div>\n      ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport angular from 'angular';\nimport '@jetbrains/ring-ui/components/template-ng/template-ng';\n\nangular\n.module('Example.template-ng', ['Ring.template']);\n      ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Template Ng #2",
      "url": "examples/template-ng/template-ng-2.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div ng-app=\"Example.template-ng\" ng-strict-di>\n  <rg-template template=\"template\" ng-controller=\"ExampleCtrl\"></rg-template>\n</div>\n      ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport angular from 'angular';\nimport TemplateNG from '@jetbrains/ring-ui/components/template-ng/template-ng';\n\nangular\n.module('Example.template-ng', [TemplateNG])\n.controller('ExampleCtrl', function ($scope) {\n  $scope.template = '<button>button</button>';\n});\n      ",
          "showCode": true
        }
      ]
    }
  ],
  "attrs": {
    "name": "Template Ng",
    "category": "Legacy Angular",
    "tags": "Ring UI Language",
    "example": "    <example name=\"Template Ng\">\n      <file name=\"index.html\">\n        <div ng-app=\"Example.template-ng\" ng-strict-di>\n          <rg-template template=\"'<input/>'\"></rg-template>\n        </div>\n      </file>\n      <file name=\"index.js\" webpack=\"true\">\n        import angular from 'angular';\n        import '@jetbrains/ring-ui/components/template-ng/template-ng';\n\n        angular\n        .module('Example.template-ng', ['Ring.template']);\n      </file>\n    </example>\n\n    <example name=\"Template Ng #2\">\n      <file name=\"index.html\">\n        <div ng-app=\"Example.template-ng\" ng-strict-di>\n          <rg-template template=\"template\" ng-controller=\"ExampleCtrl\"></rg-template>\n        </div>\n      </file>\n      <file name=\"index.js\" webpack=\"true\">\n        import angular from 'angular';\n        import TemplateNG from '@jetbrains/ring-ui/components/template-ng/template-ng';\n\n        angular\n        .module('Example.template-ng', [TemplateNG])\n        .controller('ExampleCtrl', function ($scope) {\n          $scope.template = '<button>button</button>';\n        });\n      </file>\n    </example>"
  }
};