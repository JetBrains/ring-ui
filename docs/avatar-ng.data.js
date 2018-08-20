window.source = {
  "title": "Avatar Ng",
  "url": "avatar-ng.html",
  "type": "js",
  "content": "/**\n * @name Avatar Ng\n * @category Legacy Angular\n * @tags Ring UI Language\n * @framework Angular\n * @description Provides an Angular wrapper for Avatar.\n * @example\n <example name=\"Avatar Ng\">\n   <file name=\"index.html\">\n      <div ng-app=\"test\" ng-strict-di ng-controller=\"testCtrl as $ctrl\">\n        <rg-avatar size=\"$ctrl.AvatarSize.Size32\" url=\"$ctrl.avatarUrl\"></rg-avatar>\n      </div>\n   </file>\n\n   <file name=\"index.js\">\n    import angular from 'angular';\n    import hubConfig from '@ring-ui/docs/components/hub-config';\n    import {Size as AvatarSize} from '@jetbrains/ring-ui/components/avatar/avatar';\n    import AvatarNg from '@jetbrains/ring-ui/components/avatar-ng/avatar-ng';\n\n    angular.module('test', [AvatarNg]).controller('testCtrl', function () {\n      this.AvatarSize = AvatarSize;\n      this.avatarUrl = `${hubConfig.serverUri}/api/rest/avatar/default?username=Jet%20Brains`;\n    });\n   </file>\n </example>\n */\nimport angularComponentFactory from '../global/angular-component-factory';\nimport Avatar from '../avatar/avatar';\n\nexport default angularComponentFactory(Avatar, 'Avatar').name;\n",
  "examples": [
    {
      "name": "Avatar Ng",
      "url": "examples/avatar-ng/avatar-ng.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div ng-app=\"test\" ng-strict-di ng-controller=\"testCtrl as $ctrl\">\n  <rg-avatar size=\"$ctrl.AvatarSize.Size32\" url=\"$ctrl.avatarUrl\"></rg-avatar>\n</div>\n   ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport angular from 'angular';\nimport hubConfig from '@ring-ui/docs/components/hub-config';\nimport {Size as AvatarSize} from '@jetbrains/ring-ui/components/avatar/avatar';\nimport AvatarNg from '@jetbrains/ring-ui/components/avatar-ng/avatar-ng';\n\nangular.module('test', [AvatarNg]).controller('testCtrl', function () {\n  this.AvatarSize = AvatarSize;\n  this.avatarUrl = `${hubConfig.serverUri}/api/rest/avatar/default?username=Jet%20Brains`;\n});\n   ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Provides an Angular wrapper for Avatar.",
  "attrs": {
    "name": "Avatar Ng",
    "category": "Legacy Angular",
    "tags": "Ring UI Language",
    "framework": "Angular",
    "description": "Provides an Angular wrapper for Avatar.",
    "example": " <example name=\"Avatar Ng\">\n   <file name=\"index.html\">\n      <div ng-app=\"test\" ng-strict-di ng-controller=\"testCtrl as $ctrl\">\n        <rg-avatar size=\"$ctrl.AvatarSize.Size32\" url=\"$ctrl.avatarUrl\"></rg-avatar>\n      </div>\n   </file>\n\n   <file name=\"index.js\">\n    import angular from 'angular';\n    import hubConfig from '@ring-ui/docs/components/hub-config';\n    import {Size as AvatarSize} from '@jetbrains/ring-ui/components/avatar/avatar';\n    import AvatarNg from '@jetbrains/ring-ui/components/avatar-ng/avatar-ng';\n\n    angular.module('test', [AvatarNg]).controller('testCtrl', function () {\n      this.AvatarSize = AvatarSize;\n      this.avatarUrl = `${hubConfig.serverUri}/api/rest/avatar/default?username=Jet%20Brains`;\n    });\n   </file>\n </example>"
  }
};