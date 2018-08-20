window.source = {
  "title": "Autofocus Ng",
  "url": "autofocus-ng.html",
  "type": "js",
  "content": "/**\n * @name Autofocus Ng\n * @category Legacy Angular\n * @tags Ring UI Language\n * @description Sets focus to the element if the condition is true. Supports standard input elements as well as Select.\n * @example-file ./autofocus-ng.examples.html\n */\nimport angular from 'angular';\n\nimport {FOCUSEABLE_ELEMENTS} from '../tab-trap/tab-trap';\n\nconst angularModule = angular.module('Ring.autofocus', []);\nconst RING_SELECT_SELECTOR = '[data-test=ring-select__focus]';\nconst RING_SELECT = 'rg-select';\n\nangularModule.directive('rgAutofocus', function rgAutofocusDirective() {\n\n  /**\n   * Focuses on element itself if it has \"focus\" method.\n   * Searches and focuses on select's button or input if element is rg-select\n   * @param element\n   */\n  function focusOnElement(element) {\n    if (!element) {\n      return;\n    }\n\n    if (element.hasAttribute(RING_SELECT) || element.tagName.toLowerCase() === RING_SELECT) {\n      focusOnElement(element.querySelector(RING_SELECT_SELECTOR));\n      return;\n    }\n\n    if (element.matches(FOCUSEABLE_ELEMENTS) && element.focus) {\n      element.focus();\n      return;\n    }\n\n    const focuseableChild = element.querySelector(FOCUSEABLE_ELEMENTS);\n\n    if (focuseableChild && focuseableChild.focus) {\n      focuseableChild.focus();\n    }\n  }\n\n  return (scope, iElement, iAttrs) => {\n    const element = iElement[0];\n    scope.$watch(iAttrs.rgAutofocus, newValue => {\n      if (newValue) {\n        scope.$evalAsync(() => focusOnElement(element));\n      }\n    });\n  };\n});\n\nexport default angularModule.name;\n",
  "examples": [
    {
      "name": "Autofocus Ng",
      "url": "examples/autofocus-ng/autofocus-ng.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div ng-app=\"testApp\" ng-strict-di class=\"test-container\">\n  <rg-input\n    rg-autofocus=\"true\"\n    size=\"M\"\n    placeholder=\"Should be focused\"/>\n</div>\n  ",
          "showCode": true
        },
        {
          "type": "css",
          "content": "\n:global(.test-container) {\n  padding: 8px;\n}\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport angular from 'angular';\nimport InputNg from '@jetbrains/ring-ui/components/input-ng/input-ng';\nimport ShortcutsNg from '@jetbrains/ring-ui/components/autofocus-ng/autofocus-ng';\n\nangular.module('testApp', [InputNg, ShortcutsNg])\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Autofocus on select",
      "url": "examples/autofocus-ng/autofocus-on-select.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div ng-app=\"testApp\" ng-strict-di ng-controller=\"testCtrl\" class=\"test-container\">\n  <rg-select options=\"item in []\" size=\"M\" rg-autofocus=\"true\"></rg-select>\n</div>\n  ",
          "showCode": true
        },
        {
          "type": "css",
          "content": "\n:global(.test-container) {\n  padding: 8px;\n}\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport angular from 'angular';\nimport SelectNG from '@jetbrains/ring-ui/components/select-ng/select-ng';\nimport AutofocusNG from '@jetbrains/ring-ui/components/autofocus-ng/autofocus-ng';\n\nangular.module('testApp', [SelectNG, AutofocusNG]).\n  controller('testCtrl', function ($scope) {});\n  ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Sets focus to the element if the condition is true. Supports standard input elements as well as Select.",
  "attrs": {
    "name": "Autofocus Ng",
    "category": "Legacy Angular",
    "tags": "Ring UI Language",
    "description": "Sets focus to the element if the condition is true. Supports standard input elements as well as Select.",
    "example-file": "./autofocus-ng.examples.html"
  }
};