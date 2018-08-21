window.source = {
  "title": "Button Set Ng",
  "url": "button-set-ng.html",
  "type": "js",
  "content": "/**\n * @name Button Set Ng\n * @category Legacy Angular\n * @tags Ring UI Language\n * @description Provides an Angular wrapper for Button Set.\n * @example\n   <example name=\"Button Set Ng\">\n    <file name=\"index.html\">\n      <div ng-app=\"TestApp\" ng-strict-di>\n        <rg-button-set>\n          <rg-button>Button 1</rg-button>\n          <rg-button>Button 2</rg-button>\n          <rg-button>Button 3</rg-button>\n        </rg-button-set>\n      </div>\n    </file>\n    <file name=\"index.js\" webpack=\"true\">\n     import angular from 'angular';\n     import ButtonSetNG from '@jetbrains/ring-ui/components/button-set-ng/button-set-ng';\n     import ButtonNG from '@jetbrains/ring-ui/components/button-ng/button-ng';\n     angular.module('TestApp', [ButtonNG, ButtonSetNG]);\n    </file>\n   </example>\n */\nimport angular from 'angular';\n\nconst angularModule = angular.module('Ring.button-set', []);\n\nfunction rgButtonSet() {\n  return {\n    restrict: 'E',\n    replace: true,\n    scope: false,\n    transclude: true,\n    template: require('./button-set-ng.html')\n  };\n}\n\nangularModule.directive('rgButtonSet', rgButtonSet);\n\nexport default angularModule.name;\n",
  "examples": [
    {
      "name": "Button Set Ng",
      "url": "examples/button-set-ng/button-set-ng.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div ng-app=\"TestApp\" ng-strict-di>\n  <rg-button-set>\n    <rg-button>Button 1</rg-button>\n    <rg-button>Button 2</rg-button>\n    <rg-button>Button 3</rg-button>\n  </rg-button-set>\n</div>\n    ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport angular from 'angular';\nimport ButtonSetNG from '@jetbrains/ring-ui/components/button-set-ng/button-set-ng';\nimport ButtonNG from '@jetbrains/ring-ui/components/button-ng/button-ng';\nangular.module('TestApp', [ButtonNG, ButtonSetNG]);\n    ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Provides an Angular wrapper for Button Set.",
  "attrs": {
    "name": "Button Set Ng",
    "category": "Legacy Angular",
    "tags": "Ring UI Language",
    "description": "Provides an Angular wrapper for Button Set.",
    "example": "   <example name=\"Button Set Ng\">\n    <file name=\"index.html\">\n      <div ng-app=\"TestApp\" ng-strict-di>\n        <rg-button-set>\n          <rg-button>Button 1</rg-button>\n          <rg-button>Button 2</rg-button>\n          <rg-button>Button 3</rg-button>\n        </rg-button-set>\n      </div>\n    </file>\n    <file name=\"index.js\" webpack=\"true\">\n     import angular from 'angular';\n     import ButtonSetNG from '@jetbrains/ring-ui/components/button-set-ng/button-set-ng';\n     import ButtonNG from '@jetbrains/ring-ui/components/button-ng/button-ng';\n     angular.module('TestApp', [ButtonNG, ButtonSetNG]);\n    </file>\n   </example>"
  }
};