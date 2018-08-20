window.source = {
  "title": "Footer Ng",
  "url": "footer-ng.html",
  "type": "js",
  "content": "import angular from 'angular';\n\nimport RingAngularComponent from '../global/ring-angular-component';\nimport styles from '../footer/footer.css';\nimport {copyright} from '../footer/footer';\n\n/**\n * @name Footer Ng\n * @category Legacy Angular\n * @framework Angular\n * @constructor\n * @description Renders application's footer.\n * @example\n    <example name=\"Footer Ng\">\n      <file name=\"index.html\">\n        <div id=\"footer\" ng-app=\"TestApp\" ng-strict-di>\n          <rg-footer>\n            <rg-footer-left>\n              <rg-footer-line>Left</rg-footer-line>\n              <rg-footer-line>Build 1.0.0 1234</rg-footer-line>\n            </rg-footer-left>\n            <rg-footer-center>\n              <rg-footer-line>\n                <rg-footer-copyright year=\"2000\" company-name=\"JetBrains\"></rg-footer-copyright>\n              </rg-footer-line>\n              <rg-footer-line><a class=\"ring-link\">License agreement</a></rg-footer-line>\n            </rg-footer-center>\n            <rg-footer-right>\n              <rg-footer-line>Right</rg-footer-line>\n            </rg-footer-right>\n          </rg-footer>\n        </div>\n      </file>\n      <file name=\"index.js\">\n        import angular from 'angular';\n        import Footer from '@jetbrains/ring-ui/components/footer-ng/footer-ng';\n        import '@jetbrains/ring-ui/components/link/link__legacy.css';\n\n        angular.module('TestApp', [Footer]);\n      </file>\n  </example>\n */\n\n\nconst angularModule = angular.module('Ring.footer', []);\n\nclass rgFooterComponent extends RingAngularComponent {\n  styles = styles;\n\n  static transclude = {\n    left: '?rgFooterLeft',\n    center: '?rgFooterCenter',\n    right: '?rgFooterRight'\n  };\n\n  static template = require('./footer-ng.html');\n}\n\nclass rgFooterLineComponent extends RingAngularComponent {\n  static transclude = true;\n\n  static template = `<div class=\"${styles.line}\" ng-transclude></div>`;\n}\n\nclass rgFooterCopyrightComponent extends RingAngularComponent {\n  static template = '<span>{{:: $ctrl.copyrightYears}} {{:: $ctrl.companyName}}</span>';\n\n  static bindings = {\n    year: '@',\n    companyName: '@'\n  };\n\n  $onInit() {\n    this.copyrightYears = copyright(this.year);\n  }\n}\n\nangularModule.component('rgFooter', rgFooterComponent);\nangularModule.component('rgFooterLine', rgFooterLineComponent);\nangularModule.component('rgFooterCopyright', rgFooterCopyrightComponent);\n\nexport default angularModule.name;\n",
  "examples": [
    {
      "name": "Footer Ng",
      "url": "examples/footer-ng/footer-ng.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"footer\" ng-app=\"TestApp\" ng-strict-di>\n  <rg-footer>\n    <rg-footer-left>\n      <rg-footer-line>Left</rg-footer-line>\n      <rg-footer-line>Build 1.0.0 1234</rg-footer-line>\n    </rg-footer-left>\n    <rg-footer-center>\n      <rg-footer-line>\n        <rg-footer-copyright year=\"2000\" company-name=\"JetBrains\"></rg-footer-copyright>\n      </rg-footer-line>\n      <rg-footer-line><a class=\"ring-link\">License agreement</a></rg-footer-line>\n    </rg-footer-center>\n    <rg-footer-right>\n      <rg-footer-line>Right</rg-footer-line>\n    </rg-footer-right>\n  </rg-footer>\n</div>\n      ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport angular from 'angular';\nimport Footer from '@jetbrains/ring-ui/components/footer-ng/footer-ng';\nimport '@jetbrains/ring-ui/components/link/link__legacy.css';\n\nangular.module('TestApp', [Footer]);\n      ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Renders application's footer.",
  "attrs": {
    "name": "Footer Ng",
    "category": "Legacy Angular",
    "framework": "Angular",
    "constructor": "",
    "description": "Renders application's footer.",
    "example": "    <example name=\"Footer Ng\">\n      <file name=\"index.html\">\n        <div id=\"footer\" ng-app=\"TestApp\" ng-strict-di>\n          <rg-footer>\n            <rg-footer-left>\n              <rg-footer-line>Left</rg-footer-line>\n              <rg-footer-line>Build 1.0.0 1234</rg-footer-line>\n            </rg-footer-left>\n            <rg-footer-center>\n              <rg-footer-line>\n                <rg-footer-copyright year=\"2000\" company-name=\"JetBrains\"></rg-footer-copyright>\n              </rg-footer-line>\n              <rg-footer-line><a class=\"ring-link\">License agreement</a></rg-footer-line>\n            </rg-footer-center>\n            <rg-footer-right>\n              <rg-footer-line>Right</rg-footer-line>\n            </rg-footer-right>\n          </rg-footer>\n        </div>\n      </file>\n      <file name=\"index.js\">\n        import angular from 'angular';\n        import Footer from '@jetbrains/ring-ui/components/footer-ng/footer-ng';\n        import '@jetbrains/ring-ui/components/link/link__legacy.css';\n\n        angular.module('TestApp', [Footer]);\n      </file>\n  </example>"
  }
};