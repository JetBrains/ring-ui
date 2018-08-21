window.source = {
  "title": "Pager Ng",
  "url": "pager-ng.html",
  "type": "js",
  "content": "/**\n * @name Pager Ng\n * @category Legacy Angular\n * @tags Ring UI Language\n * @framework Angular\n * @description Provides an Angular wrapper for Pager.\n * @example-file ./pager-ng.examples.html\n */\nimport angularComponentFactory from '../global/angular-component-factory';\nimport Pager from '../pager/pager';\n\nexport default angularComponentFactory(Pager, 'Pager').name;\n",
  "examples": [
    {
      "name": "Pager Ng",
      "url": "examples/pager-ng/pager-ng.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div ng-app=\"Example.pager\" ng-strict-di ng-controller=\"ExampleCtrl as ctrl\">\n  <rg-pager\n    total=\"ctrl.total\"\n    current-page=\"ctrl.currentPage\"\n    on-page-change=\"ctrl.onPageChange\"\n  ></rg-pager>\n</div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport angular from 'angular';\nimport RingPager from '@jetbrains/ring-ui/components/pager-ng/pager-ng';\n\nconst pagerModule = angular.module('Example.pager', [RingPager]);\n\npagerModule.controller('ExampleCtrl', function () {\n  this.total = 750;\n  this.currentPage = 1;\n\n  this.onPageChange = page => {\n    this.currentPage = page;\n  }\n});\n  ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Provides an Angular wrapper for Pager.",
  "attrs": {
    "name": "Pager Ng",
    "category": "Legacy Angular",
    "tags": "Ring UI Language",
    "framework": "Angular",
    "description": "Provides an Angular wrapper for Pager.",
    "example-file": "./pager-ng.examples.html"
  }
};