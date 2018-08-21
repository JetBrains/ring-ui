window.source = {
  "title": "Checkbox Ng",
  "url": "checkbox-ng.html",
  "type": "js",
  "content": "import angular from 'angular';\nimport checkmarkIcon from '@jetbrains/icons/checkmark.svg';\n\nimport IconNG from '../icon-ng/icon-ng';\nimport proxyAttrs from '../proxy-attrs/proxy-attrs';\n\nimport styles from '../checkbox/checkbox.css';\n\n/**\n * @name Checkbox Ng\n * @category Legacy Angular\n * @tags Ring UI Language\n * @description Provides an Angular wrapper for Checkbox.\n * @example\n   <example name=\"Checkbox Ng\">\n     <file name=\"index.html\">\n       <div ng-app=\"TestApp\" ng-strict-di ng-controller=\"MainCtrl\">\n         <div>Checked: {{checked}}</div>\n         <div>Disabled: {{disabled}}</div>\n         <div>\n           <rg-button id=\"checkButton\" ng-click=\"checked = !checked\">{{checked ? 'Uncheck' : 'Check'}} checkbox programmatically</rg-button>\n           <rg-button id=\"disableButton\" ng-click=\"disabled = !disabled\">{{disabled ? 'Enable' : 'Disable'}} checkbox</rg-button>\n         </div>\n         <p style=\"width: 300px;\">\n           <rg-checkbox ng-disabled=\"disabled === true\" ng-model=\"checked\">Checkbox</rg-checkbox>\n         </p>\n         <p style=\"width: 300px;\">\n           <rg-checkbox ng-disabled=\"disabled === true\" ng-model=\"checked\" ng-change=\"onNgChange()\">Inverted checkbox</rg-checkbox>\n           <div>{{ changeText }}</div>\n         </p>\n       </div>\n     </file>\n     <file name=\"index.js\" webpack=\"true\">\n       import angular from 'angular';\n       import CheckboxNG from '@jetbrains/ring-ui/components/checkbox-ng/checkbox-ng';\n       import ButtonNG from '@jetbrains/ring-ui/components/button-ng/button-ng';\n       angular.module('TestApp', [ButtonNG, CheckboxNG])\n        .controller('MainCtrl', function($scope) {\n          $scope.checked = false;\n          $scope.disabled = false;\n\n          $scope.changeText = 'text will be changed on ng-change of inverted checkbox';\n\n          $scope.onNgChange = function(newValue) {\n            $scope.changeText = 'ngChange appear for the inverted checkbox at ' + new Date();\n          }\n        });\n </file>\n   </example>\n\n   <example name=\"Checkbox Ng with custom true/false values\">\n     <file name=\"index.html\">\n       <div ng-app=\"TestApp\" ng-strict-di>\n         <div>Checked: {{checked}}</div>\n         <p style=\"width: 300px;\">\n           <rg-checkbox ng-model=\"checked\" ng-true-value=\"'The TRUE value'\" ng-false-value=\"'The FALSE value'\">Checkbox</rg-checkbox>\n         </p>\n       </div>\n     </file>\n     <file name=\"index.js\" webpack=\"true\">\n       import angular from 'angular';\n       import CheckboxNG from '@jetbrains/ring-ui/components/checkbox-ng/checkbox-ng';\n       angular.module('TestApp', [CheckboxNG]);\n </file>\n   </example>\n\n    <example name=\"Checkbox Ng (disabled)\">\n     <file name=\"index.html\">\n       <div ng-app=\"TestApp\" ng-strict-di>\n         <p style=\"width: 300px;\">\n           <rg-checkbox ng-disabled=\"true\">Checkbox</rg-checkbox>\n         </p>\n       </div>\n     </file>\n     <file name=\"index.js\" webpack=\"true\">\n       import angular from 'angular';\n       import CheckboxNG from '@jetbrains/ring-ui/components/checkbox-ng/checkbox-ng';\n       angular.module('TestApp', [CheckboxNG]);\n </file>\n   </example>\n */\n\nconst angularModule = angular.module('Ring.checkbox', [IconNG]);\n\nlet idCounter = 0;\nconst CHECKBOX_ID_PREFIX = 'rg-checkbox-';\n\nangularModule.directive('rgCheckbox', function rgCheckboxDirective() {\n  return {\n    restrict: 'E',\n    transclude: true,\n    replace: true,\n    template: proxyAttrs(`\n<label class=\"${styles.checkbox}\">\n  <input\n    data-proxy-ng-disabled\n    data-proxy-ng-model\n    data-proxy-ng-change\n    data-proxy-ng-true-value\n    data-proxy-ng-false-value\n    data-proxy-name\n    data-test=\"ring-checkbox\"\n    type=\"checkbox\"\n    class=\"${styles.input}\"\n  />\n  <span class=\"${styles.cell}\">\n    <rg-icon class=\"${styles.icon}\" size=\"14\" glyph=\"${checkmarkIcon}\" />\n  </span><span class=\"${styles.label}\" ng-transclude></span>\n</label>\n    `),\n    link: function link(scope, iElement) {\n      const input = iElement[0].query('input[type=\"checkbox\"]');\n\n      const id = CHECKBOX_ID_PREFIX + idCounter++;\n      iElement[0].setAttribute('for', id);\n      input.setAttribute('id', id);\n    }\n  };\n});\n\nexport default angularModule.name;\n",
  "examples": [
    {
      "name": "Checkbox Ng",
      "url": "examples/checkbox-ng/checkbox-ng.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div ng-app=\"TestApp\" ng-strict-di ng-controller=\"MainCtrl\">\n  <div>Checked: {{checked}}</div>\n  <div>Disabled: {{disabled}}</div>\n  <div>\n    <rg-button id=\"checkButton\" ng-click=\"checked = !checked\">{{checked ? 'Uncheck' : 'Check'}} checkbox programmatically</rg-button>\n    <rg-button id=\"disableButton\" ng-click=\"disabled = !disabled\">{{disabled ? 'Enable' : 'Disable'}} checkbox</rg-button>\n  </div>\n  <p style=\"width: 300px;\">\n    <rg-checkbox ng-disabled=\"disabled === true\" ng-model=\"checked\">Checkbox</rg-checkbox>\n  </p>\n  <p style=\"width: 300px;\">\n    <rg-checkbox ng-disabled=\"disabled === true\" ng-model=\"checked\" ng-change=\"onNgChange()\">Inverted checkbox</rg-checkbox>\n    <div>{{ changeText }}</div>\n  </p>\n</div>\n     ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport angular from 'angular';\nimport CheckboxNG from '@jetbrains/ring-ui/components/checkbox-ng/checkbox-ng';\nimport ButtonNG from '@jetbrains/ring-ui/components/button-ng/button-ng';\nangular.module('TestApp', [ButtonNG, CheckboxNG])\n .controller('MainCtrl', function($scope) {\n   $scope.checked = false;\n   $scope.disabled = false;\n\n   $scope.changeText = 'text will be changed on ng-change of inverted checkbox';\n\n   $scope.onNgChange = function(newValue) {\n     $scope.changeText = 'ngChange appear for the inverted checkbox at ' + new Date();\n   }\n });\n ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Checkbox Ng with custom true/false values",
      "url": "examples/checkbox-ng/checkbox-ng-with-custom-true-false-values.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div ng-app=\"TestApp\" ng-strict-di>\n  <div>Checked: {{checked}}</div>\n  <p style=\"width: 300px;\">\n    <rg-checkbox ng-model=\"checked\" ng-true-value=\"'The TRUE value'\" ng-false-value=\"'The FALSE value'\">Checkbox</rg-checkbox>\n  </p>\n</div>\n     ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport angular from 'angular';\nimport CheckboxNG from '@jetbrains/ring-ui/components/checkbox-ng/checkbox-ng';\nangular.module('TestApp', [CheckboxNG]);\n ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Checkbox Ng (disabled)",
      "url": "examples/checkbox-ng/checkbox-ng-disabled.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div ng-app=\"TestApp\" ng-strict-di>\n  <p style=\"width: 300px;\">\n    <rg-checkbox ng-disabled=\"true\">Checkbox</rg-checkbox>\n  </p>\n</div>\n     ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport angular from 'angular';\nimport CheckboxNG from '@jetbrains/ring-ui/components/checkbox-ng/checkbox-ng';\nangular.module('TestApp', [CheckboxNG]);\n ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Provides an Angular wrapper for Checkbox.",
  "attrs": {
    "name": "Checkbox Ng",
    "category": "Legacy Angular",
    "tags": "Ring UI Language",
    "description": "Provides an Angular wrapper for Checkbox.",
    "example": "   <example name=\"Checkbox Ng\">\n     <file name=\"index.html\">\n       <div ng-app=\"TestApp\" ng-strict-di ng-controller=\"MainCtrl\">\n         <div>Checked: {{checked}}</div>\n         <div>Disabled: {{disabled}}</div>\n         <div>\n           <rg-button id=\"checkButton\" ng-click=\"checked = !checked\">{{checked ? 'Uncheck' : 'Check'}} checkbox programmatically</rg-button>\n           <rg-button id=\"disableButton\" ng-click=\"disabled = !disabled\">{{disabled ? 'Enable' : 'Disable'}} checkbox</rg-button>\n         </div>\n         <p style=\"width: 300px;\">\n           <rg-checkbox ng-disabled=\"disabled === true\" ng-model=\"checked\">Checkbox</rg-checkbox>\n         </p>\n         <p style=\"width: 300px;\">\n           <rg-checkbox ng-disabled=\"disabled === true\" ng-model=\"checked\" ng-change=\"onNgChange()\">Inverted checkbox</rg-checkbox>\n           <div>{{ changeText }}</div>\n         </p>\n       </div>\n     </file>\n     <file name=\"index.js\" webpack=\"true\">\n       import angular from 'angular';\n       import CheckboxNG from '@jetbrains/ring-ui/components/checkbox-ng/checkbox-ng';\n       import ButtonNG from '@jetbrains/ring-ui/components/button-ng/button-ng';\n       angular.module('TestApp', [ButtonNG, CheckboxNG])\n        .controller('MainCtrl', function($scope) {\n          $scope.checked = false;\n          $scope.disabled = false;\n\n          $scope.changeText = 'text will be changed on ng-change of inverted checkbox';\n\n          $scope.onNgChange = function(newValue) {\n            $scope.changeText = 'ngChange appear for the inverted checkbox at ' + new Date();\n          }\n        });\n </file>\n   </example>\n\n   <example name=\"Checkbox Ng with custom true/false values\">\n     <file name=\"index.html\">\n       <div ng-app=\"TestApp\" ng-strict-di>\n         <div>Checked: {{checked}}</div>\n         <p style=\"width: 300px;\">\n           <rg-checkbox ng-model=\"checked\" ng-true-value=\"'The TRUE value'\" ng-false-value=\"'The FALSE value'\">Checkbox</rg-checkbox>\n         </p>\n       </div>\n     </file>\n     <file name=\"index.js\" webpack=\"true\">\n       import angular from 'angular';\n       import CheckboxNG from '@jetbrains/ring-ui/components/checkbox-ng/checkbox-ng';\n       angular.module('TestApp', [CheckboxNG]);\n </file>\n   </example>\n\n    <example name=\"Checkbox Ng (disabled)\">\n     <file name=\"index.html\">\n       <div ng-app=\"TestApp\" ng-strict-di>\n         <p style=\"width: 300px;\">\n           <rg-checkbox ng-disabled=\"true\">Checkbox</rg-checkbox>\n         </p>\n       </div>\n     </file>\n     <file name=\"index.js\" webpack=\"true\">\n       import angular from 'angular';\n       import CheckboxNG from '@jetbrains/ring-ui/components/checkbox-ng/checkbox-ng';\n       angular.module('TestApp', [CheckboxNG]);\n </file>\n   </example>"
  }
};