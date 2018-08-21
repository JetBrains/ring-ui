window.source = {
  "title": "DataList Ng",
  "url": "data-list-ng.html",
  "type": "js",
  "content": "/**\n * @name DataList Ng\n * @category Legacy Angular\n * @framework Angular\n * @description Provides an Angular wrapper for DataList.\n * @example-file ./data-list-ng.examples.html\n */\nimport angularComponentFactory from '../global/angular-component-factory';\nimport DataList from '../data-list/data-list';\n\nexport default angularComponentFactory(DataList, 'DataList').name;\n",
  "examples": [
    {
      "name": "Data List Ng",
      "url": "examples/data-list-ng/data-list-ng.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div ng-app=\"Example.data-list\" ng-strict-di ng-controller=\"ExampleCtrl as ctrl\">\n  <rg-data-list\n    data=\"ctrl.data\"\n    selection=\"ctrl.selection\"\n    on-select=\"ctrl.onSelect\"\n    item-formatter=\"ctrl.itemFormatter\"\n  ></rg-data-list>\n</div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport angular from 'angular';\nimport RingDataList from '@jetbrains/ring-ui/components/data-list-ng/data-list-ng';\nimport Selection from '@jetbrains/ring-ui/components/data-list/selection';\nimport data from '@jetbrains/ring-ui/components/data-list/data-list.mock.js';\n\nfunction itemFormatter(item) {\n  return {\n    ...item,\n    collapsible: false\n  };\n}\n\nconst selection = new Selection({\n  data,\n  isItemSelectable: item => item.selectable,\n  getChildren: item => item.items || []\n});\n\nconst exampleModule =  angular.module('Example.data-list', [RingDataList]);\n\nexampleModule.controller('ExampleCtrl', function () {\n  this.data = data;\n  this.itemFormatter = itemFormatter;\n  this.selection = selection;\n  this.onSelect = selection => {\n    this.selection = selection;\n  }\n});\n  ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Provides an Angular wrapper for DataList.",
  "attrs": {
    "name": "DataList Ng",
    "category": "Legacy Angular",
    "framework": "Angular",
    "description": "Provides an Angular wrapper for DataList.",
    "example-file": "./data-list-ng.examples.html"
  }
};