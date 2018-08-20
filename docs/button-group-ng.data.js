window.source = {
  "title": "Button Group Ng",
  "url": "button-group-ng.html",
  "type": "js",
  "content": "import angular from 'angular';\nimport 'dom4';\n\nimport styles from '../button-group/button-group.css';\n\n/**\n * @name Button Group Ng\n * @tags Ring UI Language\n * @category Legacy Angular\n * @description Provides an Angular wrapper for Button Group.\n * @example\n   <example name=\"Button Group Ng\">\n    <file name=\"index.html\">\n      <div ng-app=\"test\" ng-strict-di>\n        <div rg-button-group>\n          <span rg-button-group-caption>Side</span>\n          <rg-button>Left</rg-button>\n          <rg-button>Right</rg-button>\n        </div>\n      </div>\n    </file>\n    <file name=\"index.js\">\n      import angular from 'angular';\n      import ButtonNg from '@jetbrains/ring-ui/components/button-ng/button-ng';\n      import ButtonGroupNg from '@jetbrains/ring-ui/components/button-group-ng/button-group-ng';\n\n      angular.module('test', [ButtonNg, ButtonGroupNg]);\n    </file>\n   </example>\n */\n\nconst angularModule = angular.module('Ring.button-group', []);\n\nfunction rgButtonGroup() {\n  return {\n    restrict: 'A',\n    link: function link($scope, iElement) {\n      const element = iElement[0];\n      element.classList.add(...styles.buttonGroup.split(' '));\n    }\n  };\n}\n\nfunction rgButtonGroupCaption() {\n  return {\n    restrict: 'A',\n    link: function link($scope, iElement) {\n      const element = iElement[0];\n      element.classList.add(...styles.caption.split(' '));\n    }\n  };\n}\n\nangularModule.directive('rgButtonGroup', rgButtonGroup);\nangularModule.directive('rgButtonGroupCaption', rgButtonGroupCaption);\n\nexport default angularModule.name;\n",
  "examples": [
    {
      "name": "Button Group Ng",
      "url": "examples/button-group-ng/button-group-ng.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div ng-app=\"test\" ng-strict-di>\n  <div rg-button-group>\n    <span rg-button-group-caption>Side</span>\n    <rg-button>Left</rg-button>\n    <rg-button>Right</rg-button>\n  </div>\n</div>\n    ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport angular from 'angular';\nimport ButtonNg from '@jetbrains/ring-ui/components/button-ng/button-ng';\nimport ButtonGroupNg from '@jetbrains/ring-ui/components/button-group-ng/button-group-ng';\n\nangular.module('test', [ButtonNg, ButtonGroupNg]);\n    ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Provides an Angular wrapper for Button Group.",
  "attrs": {
    "name": "Button Group Ng",
    "tags": "Ring UI Language",
    "category": "Legacy Angular",
    "description": "Provides an Angular wrapper for Button Group.",
    "example": "   <example name=\"Button Group Ng\">\n    <file name=\"index.html\">\n      <div ng-app=\"test\" ng-strict-di>\n        <div rg-button-group>\n          <span rg-button-group-caption>Side</span>\n          <rg-button>Left</rg-button>\n          <rg-button>Right</rg-button>\n        </div>\n      </div>\n    </file>\n    <file name=\"index.js\">\n      import angular from 'angular';\n      import ButtonNg from '@jetbrains/ring-ui/components/button-ng/button-ng';\n      import ButtonGroupNg from '@jetbrains/ring-ui/components/button-group-ng/button-group-ng';\n\n      angular.module('test', [ButtonNg, ButtonGroupNg]);\n    </file>\n   </example>"
  }
};