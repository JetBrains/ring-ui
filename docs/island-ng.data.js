window.source = {
  "title": "Island Ng",
  "url": "island-ng.html",
  "type": "js",
  "content": "/**\n * @name Island Ng\n * @category Legacy Angular\n * @tags Ring UI Language\n * @framework Angular\n * @description Provides an Angular wrapper for Island.\n * @example-file ./island-ng.examples.html\n */\nimport angular from 'angular';\n\nimport styles from '../island/island.css';\n\nimport IslandHeader from './island-header-ng';\nimport IslandContent from './island-content-ng';\nimport compile from './island-ng-class-fixer';\n\nconst angularModule = angular.module('Ring.island-ng', [IslandHeader, IslandContent]);\n\nangularModule.directive('rgIsland', function islandDirective() {\n  return {\n    transclude: true,\n    replace: true,\n    bindToController: {\n      narrow: '='\n    },\n    compile,\n    template: `\n<div \n  class=\"${styles.island}\" \n  ng-class=\"{'${styles.narrowIsland}': islandCtrl.narrow}\" \n  ng-transclude\n></div>\n`,\n    controllerAs: 'islandCtrl',\n    controller: angular.noop\n  };\n});\n\nexport default angularModule.name;\n",
  "examples": [
    {
      "name": "Island Ng",
      "url": "examples/island-ng/island-ng.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div ng-app=\"Example.island\" ng-strict-di>\n  <rg-island>\n    <rg-island-header border=\"true\">\n      This is header\n    </rg-island-header>\n    <rg-island-content>\n      This is content\n    </rg-island-content>\n  </rg-island>\n</div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport angular from 'angular';\nimport IslandNg from '@jetbrains/ring-ui/components/island-ng/island-ng';\n\nconst exampleModule = angular.module('Example.island', [IslandNg]);\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Island Ng (scrollable)",
      "url": "examples/island-ng/island-ng-scrollable.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "css",
          "content": "\n:global(.limited-island) {\n  height: 200px;\n  width: 200px;\n}\n  ",
          "showCode": true
        },
        {
          "type": "html",
          "content": "\n<div ng-app=\"Example.island\" ng-strict-di>\n  <rg-island narrow=\"true\" class=\"limited-island\">\n    <rg-island-header border=\"true\">\n      Title\n    </rg-island-header>\n    <rg-island-content fade=\"true\">\n      Lorem Ipsum is simply dummy text of the printing and typesetting\n      industry. Lorem Ipsum has been the industry's standard dummy text ever\n      since the 1500s, when an unknown printer took a galley of type and\n      scrambled it to make a type specimen book. It has survived not only five\n      centuries, but also the leap into electronic typesetting, remaining\n      essentially unchanged.\n    </rg-island-content>\n  </rg-island>\n</div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport angular from 'angular';\nimport IslandNg from '@jetbrains/ring-ui/components/island-ng/island-ng';\n\nconst exampleModule = angular.module('Example.island', [IslandNg]);\n  ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Provides an Angular wrapper for Island.",
  "attrs": {
    "name": "Island Ng",
    "category": "Legacy Angular",
    "tags": "Ring UI Language",
    "framework": "Angular",
    "description": "Provides an Angular wrapper for Island.",
    "example-file": "./island-ng.examples.html"
  }
};