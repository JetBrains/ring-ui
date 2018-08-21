window.source = {
  "title": "Link Ng",
  "url": "link-ng.html",
  "type": "js",
  "content": "import angular from 'angular';\n\nimport styles from '../link/link.css';\n\n/**\n * @name Link Ng\n * @category Legacy Angular\n * @tags Ring UI Language\n * @framework Angular\n * @constructor\n * @description Displays a link.\n * @example\n    <example name=\"Link Ng\">\n      <file name=\"index.html\">\n        <div id=\"link\" ng-app=\"TestApp\" ng-strict-di>\n          <rg-link href=\"http://example.com\" class=\"test-class\">Open example</rg-link>\n        </div>\n      </file>\n      <file name=\"index.js\">\n        import angular from 'angular';\n        import Link from  '@jetbrains/ring-ui/components/link-ng/link-ng';\n\n        angular.module('TestApp', [Link]);\n      </file>\n  </example>\n */\n\n\nconst angularModule = angular.module('Ring.link', []);\n\nfunction rgLinkDirective() {\n  return {\n    restrict: 'E',\n    transclude: true,\n    replace: true,\n    template: `\n<a class=\"${styles.link} ${styles.compatibilityUnderlineMode}\"\n><span class=\"${styles.inner}\" ng-transclude></span></a>\n    `\n  };\n}\n\nangularModule.directive('rgLink', rgLinkDirective);\n\nexport default angularModule.name;\n",
  "examples": [
    {
      "name": "Link Ng",
      "url": "examples/link-ng/link-ng.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"link\" ng-app=\"TestApp\" ng-strict-di>\n  <rg-link href=\"http://example.com\" class=\"test-class\">Open example</rg-link>\n</div>\n      ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport angular from 'angular';\nimport Link from  '@jetbrains/ring-ui/components/link-ng/link-ng';\n\nangular.module('TestApp', [Link]);\n      ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Displays a link.",
  "attrs": {
    "name": "Link Ng",
    "category": "Legacy Angular",
    "tags": "Ring UI Language",
    "framework": "Angular",
    "constructor": "",
    "description": "Displays a link.",
    "example": "    <example name=\"Link Ng\">\n      <file name=\"index.html\">\n        <div id=\"link\" ng-app=\"TestApp\" ng-strict-di>\n          <rg-link href=\"http://example.com\" class=\"test-class\">Open example</rg-link>\n        </div>\n      </file>\n      <file name=\"index.js\">\n        import angular from 'angular';\n        import Link from  '@jetbrains/ring-ui/components/link-ng/link-ng';\n\n        angular.module('TestApp', [Link]);\n      </file>\n  </example>"
  }
};