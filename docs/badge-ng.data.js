window.source = {
  "title": "Badge Ng",
  "url": "badge-ng.html",
  "type": "js",
  "content": "/**\n * @name Badge Ng\n * @category Legacy Angular\n * @framework Angular\n * @description Provides an Angular wrapper for Badge.\n * @example\n  <example name=\"Badge Ng\">\n    <file type=\"html\">\n      <div ng-app=\"Example.badge\" ng-strict-di>\n        <rg-group>\n          <rg-badge>simple</rg-badge>\n          <rg-badge gray=\"true\">gray</rg-badge>\n          <rg-badge valid=\"true\">valid</rg-badge>\n          <rg-badge invalid=\"true\">invalid</rg-badge>\n          <rg-badge disabled=\"true\">disabled</rg-badge>\n        </rg-group>\n      </div>\n    </file>\n\n    <file type=\"js\">\n      import angular from 'angular';\n      import BadgeNg from '@jetbrains/ring-ui/components/badge-ng/badge-ng';\n      import GroupNg from '@jetbrains/ring-ui/components/group-ng/group-ng';\n\n      angular.module('Example.badge', [BadgeNg, GroupNg]);\n    </file>\n  </example>\n*/\n\nimport angularComponentFactory from '../global/angular-component-factory';\nimport BadgeNg from '../badge/badge';\n\nexport default angularComponentFactory(BadgeNg, 'Badge').name;\n",
  "examples": [
    {
      "name": "Badge Ng",
      "url": "examples/badge-ng/badge-ng.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div ng-app=\"Example.badge\" ng-strict-di>\n  <rg-group>\n    <rg-badge>simple</rg-badge>\n    <rg-badge gray=\"true\">gray</rg-badge>\n    <rg-badge valid=\"true\">valid</rg-badge>\n    <rg-badge invalid=\"true\">invalid</rg-badge>\n    <rg-badge disabled=\"true\">disabled</rg-badge>\n  </rg-group>\n</div>\n    ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport angular from 'angular';\nimport BadgeNg from '@jetbrains/ring-ui/components/badge-ng/badge-ng';\nimport GroupNg from '@jetbrains/ring-ui/components/group-ng/group-ng';\n\nangular.module('Example.badge', [BadgeNg, GroupNg]);\n    ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Provides an Angular wrapper for Badge.",
  "attrs": {
    "name": "Badge Ng",
    "category": "Legacy Angular",
    "framework": "Angular",
    "description": "Provides an Angular wrapper for Badge.",
    "example": "  <example name=\"Badge Ng\">\n    <file type=\"html\">\n      <div ng-app=\"Example.badge\" ng-strict-di>\n        <rg-group>\n          <rg-badge>simple</rg-badge>\n          <rg-badge gray=\"true\">gray</rg-badge>\n          <rg-badge valid=\"true\">valid</rg-badge>\n          <rg-badge invalid=\"true\">invalid</rg-badge>\n          <rg-badge disabled=\"true\">disabled</rg-badge>\n        </rg-group>\n      </div>\n    </file>\n\n    <file type=\"js\">\n      import angular from 'angular';\n      import BadgeNg from '@jetbrains/ring-ui/components/badge-ng/badge-ng';\n      import GroupNg from '@jetbrains/ring-ui/components/group-ng/group-ng';\n\n      angular.module('Example.badge', [BadgeNg, GroupNg]);\n    </file>\n  </example>"
  }
};