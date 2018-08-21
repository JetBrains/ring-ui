window.source = {
  "title": "Button Toolbar Ng",
  "url": "button-toolbar-ng.html",
  "type": "js",
  "content": "import angular from 'angular';\nimport 'dom4';\n\nimport styles from '../button-toolbar/button-toolbar.css';\n\n/**\n * @name Button Toolbar Ng\n * @tags Ring UI Language\n * @category Legacy Angular\n * @description Provides an Angular wrapper for Button Toolbar.\n * @example\n   <example name=\"Button Toolbar Ng\">\n    <file name=\"index.html\">\n      <div ng-app=\"test\" ng-strict-di>\n        <div rg-button-toolbar>\n          <rg-button mode=\"primary\" delayed=\"true\">Run</rg-button>\n          <div rg-button-group>\n            <rg-button>Button one</rg-button>\n            <rg-button>Button two</rg-button>\n            <rg-button disabled>Button three</rg-button>\n          </div>\n          <rg-button>Another action</rg-button>\n        </div>\n      </div>\n    </file>\n    <file name=\"index.js\">\n      import angular from 'angular';\n      import ButtonNg from '@jetbrains/ring-ui/components/button-ng/button-ng';\n      import ButtonGroupNg from '@jetbrains/ring-ui/components/button-group-ng/button-group-ng';\n      import ButtonToolbarNg from '@jetbrains/ring-ui/components/button-toolbar-ng/button-toolbar-ng';\n\n      angular.module('test', [ButtonNg, ButtonGroupNg, ButtonToolbarNg]);\n    </file>\n   </example>\n */\n\nconst angularModule = angular.module('Ring.button-toolbar', []);\n\nfunction rgButtonToolbar() {\n  return {\n    restrict: 'A',\n    link: function link($scope, iElement) {\n      const element = iElement[0];\n      element.classList.add(...styles.buttonToolbar.split(' '));\n    }\n  };\n}\n\nangularModule.directive('rgButtonToolbar', rgButtonToolbar);\n\nexport default angularModule.name;\n",
  "examples": [
    {
      "name": "Button Toolbar Ng",
      "url": "examples/button-toolbar-ng/button-toolbar-ng.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div ng-app=\"test\" ng-strict-di>\n  <div rg-button-toolbar>\n    <rg-button mode=\"primary\" delayed=\"true\">Run</rg-button>\n    <div rg-button-group>\n      <rg-button>Button one</rg-button>\n      <rg-button>Button two</rg-button>\n      <rg-button disabled>Button three</rg-button>\n    </div>\n    <rg-button>Another action</rg-button>\n  </div>\n</div>\n    ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport angular from 'angular';\nimport ButtonNg from '@jetbrains/ring-ui/components/button-ng/button-ng';\nimport ButtonGroupNg from '@jetbrains/ring-ui/components/button-group-ng/button-group-ng';\nimport ButtonToolbarNg from '@jetbrains/ring-ui/components/button-toolbar-ng/button-toolbar-ng';\n\nangular.module('test', [ButtonNg, ButtonGroupNg, ButtonToolbarNg]);\n    ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Provides an Angular wrapper for Button Toolbar.",
  "attrs": {
    "name": "Button Toolbar Ng",
    "tags": "Ring UI Language",
    "category": "Legacy Angular",
    "description": "Provides an Angular wrapper for Button Toolbar.",
    "example": "   <example name=\"Button Toolbar Ng\">\n    <file name=\"index.html\">\n      <div ng-app=\"test\" ng-strict-di>\n        <div rg-button-toolbar>\n          <rg-button mode=\"primary\" delayed=\"true\">Run</rg-button>\n          <div rg-button-group>\n            <rg-button>Button one</rg-button>\n            <rg-button>Button two</rg-button>\n            <rg-button disabled>Button three</rg-button>\n          </div>\n          <rg-button>Another action</rg-button>\n        </div>\n      </div>\n    </file>\n    <file name=\"index.js\">\n      import angular from 'angular';\n      import ButtonNg from '@jetbrains/ring-ui/components/button-ng/button-ng';\n      import ButtonGroupNg from '@jetbrains/ring-ui/components/button-group-ng/button-group-ng';\n      import ButtonToolbarNg from '@jetbrains/ring-ui/components/button-toolbar-ng/button-toolbar-ng';\n\n      angular.module('test', [ButtonNg, ButtonGroupNg, ButtonToolbarNg]);\n    </file>\n   </example>"
  }
};