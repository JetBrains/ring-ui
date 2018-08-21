window.source = {
  "title": "Toggle Ng",
  "url": "toggle-ng.html",
  "type": "js",
  "content": "/**\n * @name Toggle Ng\n * @category Legacy Angular\n * @tags Ring UI Language\n * @framework Angular\n * @description Provides an Angular wrapper for Toggle.\n * @example-file ./toggle-ng.examples.html\n */\nimport angularComponentFactory from '../global/angular-component-factory';\nimport Toggle from '../toggle/toggle';\n\nexport default angularComponentFactory(Toggle, 'Toggle').name;\n\n",
  "examples": [
    {
      "name": "Toggle",
      "url": "examples/toggle-ng/toggle.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div ng-app=\"test\" ng-strict-di>\n  <rg-toggle></rg-toggle>\n</div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport angular from 'angular';\nimport ToggleNg from '@jetbrains/ring-ui/components/toggle-ng/toggle-ng';\n\nangular.module('test', [ToggleNg]);\n  ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Provides an Angular wrapper for Toggle.",
  "attrs": {
    "name": "Toggle Ng",
    "category": "Legacy Angular",
    "tags": "Ring UI Language",
    "framework": "Angular",
    "description": "Provides an Angular wrapper for Toggle.",
    "example-file": "./toggle-ng.examples.html"
  }
};