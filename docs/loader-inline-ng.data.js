window.source = {
  "title": "Loader Inline Ng",
  "url": "loader-inline-ng.html",
  "type": "js",
  "content": "import angular from 'angular';\n\nimport styles from '../loader-inline/loader-inline.css';\nimport injectStyles from '../loader-inline/inject-styles';\nimport Theme from '../global/theme';\n\n/**\n * @name Loader Inline Ng\n * @category Legacy Angular\n * @framework Angular\n * @constructor\n * @description Wraps markup for loader-inline component.\n * @example\n    <example name=\"Loader Inline Ng\">\n      <file name=\"index.html\">\n        <div ng-app=\"TestApp\" ng-strict-di>\n           <div>\n             <span>some text on top</span>\n             <div>before <rg-loader-inline></rg-loader-inline> Some text after</div>\n             <div>some text under loader</div>\n           </div>\n        </div>\n      </file>\n      <file name=\"index.js\">\n        import angular from 'angular';\n        import LoaderInline from  '@jetbrains/ring-ui/components/loader-inline-ng/loader-inline-ng';\n\n        angular.module('TestApp', [LoaderInline]);\n      </file>\n  </example>\n */\n\n\nconst angularModule = angular.module('Ring.loader-inline', []);\n\nclass LoaderController {\n  $onInit() {\n    injectStyles();\n\n    this.theme = this.theme || Theme.LIGHT;\n  }\n\n  getThemeClass = () => `${styles.loader}_${this.theme}`;\n}\n\nangularModule.\n  component('rgLoaderInline', {\n    bindings: {\n      theme: '@?'\n    },\n    template: `<div data-test=\"ring-loader-inline-ng\" class=\"${styles.loader}\" ng-class=\"$ctrl.getThemeClass()\"></div>`,\n    controller: LoaderController\n  });\n\nexport default angularModule.name;\n",
  "examples": [
    {
      "name": "Loader Inline Ng",
      "url": "examples/loader-inline-ng/loader-inline-ng.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div ng-app=\"TestApp\" ng-strict-di>\n   <div>\n     <span>some text on top</span>\n     <div>before <rg-loader-inline></rg-loader-inline> Some text after</div>\n     <div>some text under loader</div>\n   </div>\n</div>\n      ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport angular from 'angular';\nimport LoaderInline from  '@jetbrains/ring-ui/components/loader-inline-ng/loader-inline-ng';\n\nangular.module('TestApp', [LoaderInline]);\n      ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Wraps markup for loader-inline component.",
  "attrs": {
    "name": "Loader Inline Ng",
    "category": "Legacy Angular",
    "framework": "Angular",
    "constructor": "",
    "description": "Wraps markup for loader-inline component.",
    "example": "    <example name=\"Loader Inline Ng\">\n      <file name=\"index.html\">\n        <div ng-app=\"TestApp\" ng-strict-di>\n           <div>\n             <span>some text on top</span>\n             <div>before <rg-loader-inline></rg-loader-inline> Some text after</div>\n             <div>some text under loader</div>\n           </div>\n        </div>\n      </file>\n      <file name=\"index.js\">\n        import angular from 'angular';\n        import LoaderInline from  '@jetbrains/ring-ui/components/loader-inline-ng/loader-inline-ng';\n\n        angular.module('TestApp', [LoaderInline]);\n      </file>\n  </example>"
  }
};