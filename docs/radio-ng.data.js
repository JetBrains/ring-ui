window.source = {
  "title": "Radio Ng",
  "url": "radio-ng.html",
  "type": "js",
  "content": "import angular from 'angular';\n\nimport styles from '../radio/radio.css';\nimport proxyAttrs from '../proxy-attrs/proxy-attrs';\nimport getUID from '../global/get-uid';\n\n/**\n * @name Radio Ng\n * @category Legacy Angular\n * @tags Ring UI Language\n * @framework Angular\n * @description Provides an Radio component.\n * @example-file ./radio-ng.examples.html\n */\nconst angularModule = angular.module('Ring.radio', []);\n\nangularModule.directive('rgRadio', function rgCheckboxDirective() {\n  return {\n    restrict: 'E',\n    transclude: true,\n    replace: true,\n    template: proxyAttrs(`\n      <label class=\"${styles.radio}\" data-test=\"ring-radio\">\n        <input\n          type=\"radio\"\n          class=${styles.input}\n          \n          data-proxy-ng-disabled\n          data-proxy-ng-model\n          data-proxy-ng-change\n          data-proxy-name\n          data-proxy-value\n          data-proxy-ng-value\n        />\n        <span class=\"${styles.circle}\"></span>\n        <span class=\"${styles.label}\" ng-transclude></span>\n      </label>\n\n`),\n    link: function link(scope, iElement) {\n      const element = iElement[0];\n      const input = element.querySelector('input[type=\"radio\"]');\n\n      function usePassedID() {\n        const {id} = element;\n        element.setAttribute('for', id);\n        input.setAttribute('id', id);\n        element.removeAttribute('id');\n      }\n\n      function generateID() {\n        const id = getUID('ring-radio-item-');\n        element.setAttribute('for', id);\n        input.setAttribute('id', id);\n      }\n\n      if (element.id) {\n        usePassedID();\n      } else {\n        generateID();\n      }\n    }\n  };\n});\n\nexport default angularModule.name;\n",
  "examples": [
    {
      "name": "Radio Ng",
      "url": "examples/radio-ng/radio-ng.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div ng-app=\"Example.radio\" ng-strict-di ng-controller=\"ExampleCtrl as ctrl\">\n  <rg-radio ng-model=\"ctrl.selected\" value=\"one\" name=\"first\" id=\"one-option\">One</rg-radio>\n  <rg-radio ng-model=\"ctrl.selected\" value=\"two\" name=\"second\">Two</rg-radio>\n\n  <div>Selected value is \"{{ctrl.selected}}\"</div>\n</div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport angular from 'angular';\nimport RingRadio from '@jetbrains/ring-ui/components/radio-ng/radio-ng';\n\nconst radioModule = angular.module('Example.radio', [RingRadio]);\n\nradioModule.controller('ExampleCtrl', function () {\n  this.selected = 'two'\n});\n  ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Provides an Radio component.",
  "attrs": {
    "name": "Radio Ng",
    "category": "Legacy Angular",
    "tags": "Ring UI Language",
    "framework": "Angular",
    "description": "Provides an Radio component.",
    "example-file": "./radio-ng.examples.html"
  }
};