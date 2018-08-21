window.source = {
  "title": "User Card Ng",
  "url": "user-card-ng.html",
  "type": "js",
  "content": "/**\n * @name User Card Ng\n * @category Legacy Angular\n * @tags Ring UI Language\n * @framework Angular\n * @description Provides an Angular wrapper for User Card.\n * @example-file ./user-card-ng.examples.html\n */\nimport angular from 'angular';\n\nimport {createAngularComponent} from '../global/angular-component-factory';\nimport SmartUserCardTooltip from '../user-card/smart-user-card-tooltip';\nimport UserCardTooltip from '../user-card/tooltip';\n\nconst angularModule = angular.module('Ring.user-card', []);\n\nangularModule.\n  component('rgUserCardTooltip', createAngularComponent(UserCardTooltip, 'UserCardTooltip')).\n  component('rgSmartUserCardTooltip', createAngularComponent(SmartUserCardTooltip, 'SmartUserCardTooltip'));\n\nexport default angularModule.name;\n",
  "examples": [
    {
      "name": "User Card Tooltip",
      "url": "examples/user-card-ng/user-card-tooltip.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<div ng-app=\"Example.userCard\" ng-strict-di ng-controller=\"ExampleCtrl as $ctrl\">\n  <rg-user-card-tooltip\n    user=\"$ctrl.user\"\n  >\n    Hover me to see {{$ctrl.user.name}}'s card\n  </rg-user-card-tooltip>\n</div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport angular from 'angular';\nimport UserCardNg from '@jetbrains/ring-ui/components/user-card-ng/user-card-ng';\n\nangular.module('Example.userCard', [UserCardNg]).\n  controller('ExampleCtrl', function () {\n    this.user = {\n      login: 'testuser',\n      name: 'Test User',\n      email: 'testuser@mail.com',\n      avatarUrl: `${hubConfig.serverUri}/api/rest/avatar/default?username=Jet%20Brains`,\n      href: `${hubConfig.serverUri}/users/0`\n    };\n  });\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Hub User Card Tooltip",
      "url": "examples/user-card-ng/hub-user-card-tooltip.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<div ng-app=\"Example.hubUserCard\" ng-strict-di ng-controller=\"ExampleCtrl as $ctrl\">\n  <rg-smart-user-card-tooltip\n    user-data-source=\"$ctrl.userSource\"\n  >\n    Hover me to see current user's card\n  </rg-smart-user-card-tooltip>\n</div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport angular from 'angular';\nimport UserCardNg from '@jetbrains/ring-ui/components/user-card-ng/user-card-ng';\nimport {createHubUserCardSource} from '@jetbrains/ring-ui/components/hub-source/hub-source__user.js';\nimport Auth from '@jetbrains/ring-ui/components/auth/auth';\nimport hubConfig from '@ring-ui/docs/components/hub-config';\n\nangular.module('Example.hubUserCard', [UserCardNg]).\n  controller('ExampleCtrl', function () {\n    const auth = new Auth(hubConfig);\n\n    this.userSource = async () => {\n      await auth.init();\n      const userSource = createHubUserCardSource(auth, auth.user.id);\n      return userSource();\n    };\n  });\n  ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Provides an Angular wrapper for User Card.",
  "attrs": {
    "name": "User Card Ng",
    "category": "Legacy Angular",
    "tags": "Ring UI Language",
    "framework": "Angular",
    "description": "Provides an Angular wrapper for User Card.",
    "example-file": "./user-card-ng.examples.html"
  }
};