window.source = {
  "title": "Confirm Ng",
  "url": "confirm-ng.html",
  "type": "js",
  "content": "import angular from 'angular';\n\nimport confirm from '../confirm-service/confirm-service';\nimport MessageBundle from '../message-bundle-ng/message-bundle-ng';\n\n/**\n * @name Confirm Ng\n * @category Legacy Angular\n * @tags Ring UI Language\n * @description Displays a confirmation prompt.\n * @example\n  <example name=\"Confirm Ng\">\n    <file name=\"index.html\" disable-auto-size>\n      <div id=\"loader\" ng-app=\"TestApp\" ng-strict-di>\n        <div rg-dialog></div>\n        <div ng-controller=\"TestCtrl\"></div>\n      </div>\n    </file>\n    <file name=\"index.js\">\n      import angular from 'angular';\n      import ConfirmNg from '@jetbrains/ring-ui/components/confirm-ng/confirm-ng';\n\n      angular.module('TestApp', [ConfirmNg]).\n        controller('TestCtrl', function (confirm) {\n          confirm('Do you really wish to proceed?', 'A description of an action that is about to take place.').\n            then(() => console.log('Confirmed')).\n            catch(() => console.log('Declined'));\n        })\n    </file>\n  </example>\n */\n\nconst angularModule = angular.module('Ring.confirm', [\n  MessageBundle\n]);\n\nangularModule.service('confirm', ($q, RingMessageBundle) =>\n  function showConfirm(message, description, actionTitle, cancelTitle, cancelIsDefault, actionFn) {\n    return $q.when(confirm({\n      text: message,\n      description,\n      confirmLabel: actionTitle || RingMessageBundle.confirmation_ok(),\n      rejectLabel: cancelTitle || RingMessageBundle.confirmation_cancel(),\n      cancelIsDefault,\n      onBeforeConfirm: actionFn\n    }));\n  }\n);\n\nexport default angularModule.name;\n",
  "examples": [
    {
      "name": "Confirm Ng",
      "url": "examples/confirm-ng/confirm-ng.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"loader\" ng-app=\"TestApp\" ng-strict-di>\n  <div rg-dialog></div>\n  <div ng-controller=\"TestCtrl\"></div>\n</div>\n    ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport angular from 'angular';\nimport ConfirmNg from '@jetbrains/ring-ui/components/confirm-ng/confirm-ng';\n\nangular.module('TestApp', [ConfirmNg]).\n  controller('TestCtrl', function (confirm) {\n    confirm('Do you really wish to proceed?', 'A description of an action that is about to take place.').\n      then(() => console.log('Confirmed')).\n      catch(() => console.log('Declined'));\n  })\n    ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Displays a confirmation prompt.",
  "attrs": {
    "name": "Confirm Ng",
    "category": "Legacy Angular",
    "tags": "Ring UI Language",
    "description": "Displays a confirmation prompt.",
    "example": "  <example name=\"Confirm Ng\">\n    <file name=\"index.html\" disable-auto-size>\n      <div id=\"loader\" ng-app=\"TestApp\" ng-strict-di>\n        <div rg-dialog></div>\n        <div ng-controller=\"TestCtrl\"></div>\n      </div>\n    </file>\n    <file name=\"index.js\">\n      import angular from 'angular';\n      import ConfirmNg from '@jetbrains/ring-ui/components/confirm-ng/confirm-ng';\n\n      angular.module('TestApp', [ConfirmNg]).\n        controller('TestCtrl', function (confirm) {\n          confirm('Do you really wish to proceed?', 'A description of an action that is about to take place.').\n            then(() => console.log('Confirmed')).\n            catch(() => console.log('Declined'));\n        })\n    </file>\n  </example>"
  }
};