window.source = {
  "title": "Progress Bar Ng",
  "url": "progress-bar-ng.html",
  "type": "js",
  "content": "/**\n * @name Progress Bar Ng\n * @category Legacy Angular\n * @tags Ring UI Language\n * @framework Angular\n * @description Provides an Angular wrapper for Progress Bar.\n * @example-file ./progress-bar-ng.examples.html\n */\nimport angularComponentFactory from '../global/angular-component-factory';\nimport ProgressBar from '../progress-bar/progress-bar';\n\nexport default angularComponentFactory(ProgressBar, 'ProgressBar').name;\n",
  "examples": [
    {
      "name": "Progress Bar Ng",
      "url": "examples/progress-bar-ng/progress-bar-ng.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div ng-app=\"Example.progressBar\" ng-strict-di ng-controller=\"ExampleCtrl as ctrl\">\n\n  <div style=\"height: 25px; padding-top: 25px;\">\n    <rg-progress-bar value=\"ctrl.value\"></rg-progress-bar>\n  </div>\n  <div style=\"height: 25px; background: #000; padding-top: 25px;\">\n    <rg-progress-bar value=\"ctrl.value\" theme=\"'dark'\"></rg-progress-bar>\n  </div>\n  <div style=\"height: 25px; background: #F0F0F0; padding-top: 25px;\">\n    <rg-progress-bar value=\"ctrl.value\"></rg-progress-bar>\n  </div>\n\n</div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport angular from 'angular';\nimport RingProgressBar from '@jetbrains/ring-ui/components/progress-bar-ng/progress-bar-ng';\n\nangular.module('Example.progressBar', [RingProgressBar]).\n  controller('ExampleCtrl', function ($interval) {\n    this.value = 0;\n\n    $interval(() => {\n      const currentValue = this.value;\n      this.value = currentValue >= 1 ? 0 : currentValue + 0.1;\n    }, 500);\n\n\n  });\n  ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Provides an Angular wrapper for Progress Bar.",
  "attrs": {
    "name": "Progress Bar Ng",
    "category": "Legacy Angular",
    "tags": "Ring UI Language",
    "framework": "Angular",
    "description": "Provides an Angular wrapper for Progress Bar.",
    "example-file": "./progress-bar-ng.examples.html"
  }
};