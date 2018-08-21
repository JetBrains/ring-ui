window.source = {
  "title": "Table Ng",
  "url": "table-ng.html",
  "type": "js",
  "content": "/**\n * @name Table Ng\n * @category Legacy Angular\n * @tags Ring UI Language\n * @framework Angular\n * @description Provides an Angular wrapper for Table.\n * @example-file ./table-ng.examples.html\n */\nimport angularComponentFactory from '../global/angular-component-factory';\nimport Table from '../table/table';\n\nexport default angularComponentFactory(Table, 'Table').name;\n",
  "examples": [
    {
      "name": "Table Ng",
      "url": "examples/table-ng/table-ng.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div ng-app=\"Example.table\" ng-strict-di ng-controller=\"ExampleCtrl as ctrl\">\n  <h3>Title of the page</h3>\n\n  <rg-legacy-table-toolbar stick>\n    <div>Some toolbar content. Focused: {{ctrl.selection.getFocused().country}}</div>\n  </rg-legacy-table-toolbar>\n\n  <rg-table\n    data=\"ctrl.data\"\n    columns=\"ctrl.columns\"\n    selection=\"ctrl.selection\"\n    on-select=\"ctrl.onSelect\"\n    autofocus=\"true\"\n    sticky-header-offset=\"'56px'\"\n\n    sort-key=\"ctrl.sortKey\"\n    sort-order=\"ctrl.sortOrder\"\n    on-sort=\"ctrl.onSort\"\n  ></rg-table>\n</div>\n  ",
          "showCode": true
        },
        {
          "type": "css",
          "content": "\nbody {\n  margin: 0;\n  padding: 0;\n}\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport angular from 'angular';\nimport RingTable from '@jetbrains/ring-ui/components/table-ng/table-ng';\nimport TableLegacyToolbar from '@jetbrains/ring-ui/components/table-legacy-ng/table-legacy-ng__toolbar'\nimport Selection from '@jetbrains/ring-ui/components/table/selection';\nimport data from '@jetbrains/ring-ui/components/table/table.examples.json';\n\nconst columns = [\n  {\n    id: 'country',\n    title: 'Country'\n  },\n  {\n    id: 'city',\n    title: 'City',\n    sortable: true\n  },\n  {\n    id: 'url',\n    title: 'URL'\n  }\n];\n\nconst exampleModule =  angular.module('Example.table', [RingTable, TableLegacyToolbar]);\n\nexampleModule.controller('ExampleCtrl', function () {\n  this.data = data;\n  this.columns = columns;\n  this.selection = new Selection({data});\n  this.sortKey = 'city';\n  this.sortOrder = false;\n\n  this.onSelect = selection => {\n    this.selection = selection;\n  }\n\n  this.onSort = ({column: {id: key}, order}) => {\n    this.sortOrder = order;\n    this.data = this.data.slice().sort((itemA, itemB) => {\n      return order ? itemA[key].localeCompare(itemB[key]) : itemB[key].localeCompare(itemA[key]);\n    });\n  };\n});\n  ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Provides an Angular wrapper for Table.",
  "attrs": {
    "name": "Table Ng",
    "category": "Legacy Angular",
    "tags": "Ring UI Language",
    "framework": "Angular",
    "description": "Provides an Angular wrapper for Table.",
    "example-file": "./table-ng.examples.html"
  }
};