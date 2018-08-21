window.source = {
  "title": "Group Ng",
  "url": "group-ng.html",
  "type": "js",
  "content": "/**\n * @name Group Ng\n * @category Legacy Angular\n * @framework Angular\n * @tags Ring UI Language\n * @description Provides an Angular wrapper for Group.\n * @example\n  <example name=\"Group Ng\">\n    <file type=\"html\">\n      <div ng-app=\"Example.group\" ng-strict-di ng-controller=\"ExampleCtrl as ctrl\">\n        <rg-group>\n          <rg-button>First item</rg-button>\n          <rg-button>Second item</rg-button>\n        </rg-group>\n      </div>\n    </file>\n\n    <file type=\"js\">\n      import angular from 'angular';\n      import ButtonNg from '@jetbrains/ring-ui/components/button-ng/button-ng';\n      import GroupNg from '@jetbrains/ring-ui/components/group-ng/group-ng';\n\n      angular.module('Example.group', [ButtonNg, GroupNg]).\n        controller('ExampleCtrl', angular.noop);\n    </file>\n  </example>\n*/\n\nimport angular from 'angular';\n\nimport styles from '../group/group.css';\n\nconst angularModule = angular.module('Ring.group', []);\n\nangularModule.component('rgGroup', {\n  transclude: true,\n  template: `<span ng-transclude class=\"${styles.group}\"></span>`\n});\n\nexport default angularModule.name;\n",
  "examples": [
    {
      "name": "Group Ng",
      "url": "examples/group-ng/group-ng.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div ng-app=\"Example.group\" ng-strict-di ng-controller=\"ExampleCtrl as ctrl\">\n  <rg-group>\n    <rg-button>First item</rg-button>\n    <rg-button>Second item</rg-button>\n  </rg-group>\n</div>\n    ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport angular from 'angular';\nimport ButtonNg from '@jetbrains/ring-ui/components/button-ng/button-ng';\nimport GroupNg from '@jetbrains/ring-ui/components/group-ng/group-ng';\n\nangular.module('Example.group', [ButtonNg, GroupNg]).\n  controller('ExampleCtrl', angular.noop);\n    ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Provides an Angular wrapper for Group.",
  "attrs": {
    "name": "Group Ng",
    "category": "Legacy Angular",
    "framework": "Angular",
    "tags": "Ring UI Language",
    "description": "Provides an Angular wrapper for Group.",
    "example": "  <example name=\"Group Ng\">\n    <file type=\"html\">\n      <div ng-app=\"Example.group\" ng-strict-di ng-controller=\"ExampleCtrl as ctrl\">\n        <rg-group>\n          <rg-button>First item</rg-button>\n          <rg-button>Second item</rg-button>\n        </rg-group>\n      </div>\n    </file>\n\n    <file type=\"js\">\n      import angular from 'angular';\n      import ButtonNg from '@jetbrains/ring-ui/components/button-ng/button-ng';\n      import GroupNg from '@jetbrains/ring-ui/components/group-ng/group-ng';\n\n      angular.module('Example.group', [ButtonNg, GroupNg]).\n        controller('ExampleCtrl', angular.noop);\n    </file>\n  </example>"
  }
};