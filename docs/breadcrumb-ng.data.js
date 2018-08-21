window.source = {
  "title": "Breadcrumb Ng",
  "url": "breadcrumb-ng.html",
  "type": "js",
  "content": "import angular from 'angular';\n\nimport '../breadcrumb/breadcrumb.scss';\nimport LinkModule from '../link-ng/link-ng';\nimport IconModule from '../icon-ng/icon-ng';\n\n/**\n * @name Breadcrumb Ng\n * @category Legacy Angular\n * @description Displays a breadcrumb.\n * @example\n   <example name=\"Breadcrumb Ng\">\n     <file name=\"index.html\">\n     <div ng-app=\"Example.breadcrumb\" ng-strict-di>\n       <div ng-controller=\"DemoCtrl as ctrl\">\n         <rg-breadcrumb label=\"First level\" link=\"test/href1\">\n           <rg-breadcrumb label=\"Second level\" on-click=\"ctrl.clickSecondLevel()\">\n            <span>Active level</span>\n           </rg-breadcrumb>\n         </rg-breadcrumb>\n       </div>\n     </div>\n     </file>\n     <file name=\"index.js\">\n       import angular from 'angular';\n       import BreadcrumbNG from '@jetbrains/ring-ui/components/breadcrumb-ng/breadcrumb-ng';\n\n       angular.module('Example.breadcrumb', [BreadcrumbNG])\n         .controller('DemoCtrl', function () {\n            this.clickSecondLevel =  () => alert('Second level was clicked');\n         });\n     </file>\n   </example>\n */\n\n\nconst angularModule = angular.module('Ring.breadcrumb', [LinkModule, IconModule]);\n\nangularModule.directive('rgBreadcrumb', function rgBreadcrumbDirective() {\n  return {\n    template: require('./breadcrumb-ng.html'),\n    replace: true,\n    transclude: true,\n    restrict: 'E',\n\n    scope: {\n      label: '@',\n      link: '@',\n      onClick: '&'\n    }\n  };\n});\n\nexport default angularModule.name;\n",
  "examples": [
    {
      "name": "Breadcrumb Ng",
      "url": "examples/breadcrumb-ng/breadcrumb-ng.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div ng-app=\"Example.breadcrumb\" ng-strict-di>\n  <div ng-controller=\"DemoCtrl as ctrl\">\n    <rg-breadcrumb label=\"First level\" link=\"test/href1\">\n      <rg-breadcrumb label=\"Second level\" on-click=\"ctrl.clickSecondLevel()\">\n       <span>Active level</span>\n      </rg-breadcrumb>\n    </rg-breadcrumb>\n  </div>\n</div>\n",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport angular from 'angular';\nimport BreadcrumbNG from '@jetbrains/ring-ui/components/breadcrumb-ng/breadcrumb-ng';\n\nangular.module('Example.breadcrumb', [BreadcrumbNG])\n  .controller('DemoCtrl', function () {\n     this.clickSecondLevel =  () => alert('Second level was clicked');\n  });\n     ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Displays a breadcrumb.",
  "attrs": {
    "name": "Breadcrumb Ng",
    "category": "Legacy Angular",
    "description": "Displays a breadcrumb.",
    "example": "   <example name=\"Breadcrumb Ng\">\n     <file name=\"index.html\">\n     <div ng-app=\"Example.breadcrumb\" ng-strict-di>\n       <div ng-controller=\"DemoCtrl as ctrl\">\n         <rg-breadcrumb label=\"First level\" link=\"test/href1\">\n           <rg-breadcrumb label=\"Second level\" on-click=\"ctrl.clickSecondLevel()\">\n            <span>Active level</span>\n           </rg-breadcrumb>\n         </rg-breadcrumb>\n       </div>\n     </div>\n     </file>\n     <file name=\"index.js\">\n       import angular from 'angular';\n       import BreadcrumbNG from '@jetbrains/ring-ui/components/breadcrumb-ng/breadcrumb-ng';\n\n       angular.module('Example.breadcrumb', [BreadcrumbNG])\n         .controller('DemoCtrl', function () {\n            this.clickSecondLevel =  () => alert('Second level was clicked');\n         });\n     </file>\n   </example>"
  }
};