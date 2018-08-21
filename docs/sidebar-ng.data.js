window.source = {
  "title": "Sidebar Ng",
  "url": "sidebar-ng.html",
  "type": "js",
  "content": "import angular from 'angular';\n\nimport PlaceUnder from '../place-under-ng/place-under-ng';\nimport IconNG from '../icon-ng/icon-ng';\nimport RingAngularComponent from '../global/ring-angular-component';\nimport ButtonNG from '../button-ng/button-ng';\n\nimport '../sidebar/sidebar.scss';\n\n/**\n * @name Sidebar Ng\n * @category Legacy Angular\n * @description Provides an Angular wrapper for Sidebar.\n * To make sidebar have fixed positioning under some other element (e.g. toolbar),\n * a selector for that element should be passed as placeUnderSibling parameter.\n * @example-file ./sidebar-ng.examples.html\n */\n\nconst angularModule = angular.module('Ring.sidebar', [PlaceUnder, IconNG, ButtonNG]);\n\nclass SidebarController extends RingAngularComponent {\n  static $inject = ['$scope'];\n\n  constructor(...args) {\n    super(...args);\n\n    this.$onInit = () => {\n      const {$scope} = this.$inject;\n\n      this.dialogIsActive = false;\n      this.showed = this.show;\n\n      // dialog has been opened — open sidebar\n      $scope.$watch(() => this.dialogIsActive, () => {\n        if (this.dialogIsActive) {\n          this.show = true;\n        } else if (!this.showed) {\n          this.show = false;\n        }\n      });\n\n      $scope.$watch(() => this.show, () => {\n        if (!this.dialogIsActive) {\n          this.showed = this.show;\n        }\n      });\n    };\n  }\n}\n\nfunction rgSidebarDirective() {\n  return {\n    restrict: 'E',\n    transclude: true,\n    replace: true,\n    scope: {},\n    controller: SidebarController,\n    /**\n    * {{\n    *   show: boolean,\n    *   placeUnderSibling: ?string, a selector for an element the sidebar should stick to\n    *   topOffset: ?number, sidebar top offset\n    * }}\n    */\n    bindToController: {\n      show: '=',\n      placeUnderSibling: '@',\n      topOffset: '=?',\n      dialogIsActive: '=?'\n    },\n    template: require('./sidebar-ng.html'),\n    controllerAs: 'sidebar'\n  };\n}\n\nfunction rgSidebarToggleButtonDirective() {\n  return {\n    restrict: 'E',\n    transclude: true,\n    replace: true,\n    scope: {},\n    controller() {},\n    bindToController: {\n      model: '=',\n      dialogIsActive: '=?'\n    },\n    template: require('./sidebar-ng__button.html'),\n    controllerAs: 'button'\n  };\n}\n\nangularModule.directive('rgSidebar', rgSidebarDirective);\nangularModule.directive('rgSidebarToggleButton', rgSidebarToggleButtonDirective);\n\nexport default angularModule.name;\n",
  "examples": [
    {
      "name": "Sidebar Ng",
      "url": "examples/sidebar-ng/sidebar-ng.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<div ng-app=\"Ring.sidebar\" ng-strict-di ng-init=\"isShowSideBar = true\"\n  style=\"position: relative;\">\n  <rg-sidebar\n    show=\"isShowSideBar\"\n    place-under-sibling=\".some-toolbar\"\n    top-offset=\"1\">\n    <div>\n\n      <img class=\"ring-sidebar__avatar\"\n           ng-src=\"http://via.placeholder.com/64x64\"/>\n\n      <h3 class=\"ring-sidebar__title\">\n        <a class=\"ring-link\" href=\"#\">User Link</a>\n      </h3>\n\n      <div class=\"ring-sidebar__section\">\n        <span class=\"ring-sidebar__section-title\" translate>Full Name</span>\n\n        <div class=\"ring-sidebar__section-text\">Value</div>\n      </div>\n    </div>\n  </rg-sidebar>\n  <div class=\"some-toolbar\">\n    Toolbar to place before sidebar\n    <rg-sidebar-toggle-button model=\"isShowSideBar\">Toggle sidebar\n    </rg-sidebar-toggle-button>\n  </div>\n</div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport angular from 'angular';\nimport '@jetbrains/ring-ui/components/sidebar-ng/sidebar-ng';\nimport '@jetbrains/ring-ui/components/link/link__legacy.css';\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Sidebar Ng with a lot of content",
      "url": "examples/sidebar-ng/sidebar-ng-with-a-lot-of-content.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<div id=\"content-before\">\n  <div>Lorem</div>\n  <div>Ipsum</div>\n  <div>Lorem</div>\n  <div>Lorem</div>\n  <div>Lorem</div>\n</div>\n<div ng-app=\"foo\" ng-strict-di ng-init=\"isShowSideBar = true\"\n  style=\"position: relative;\">\n  <rg-sidebar show=\"isShowSideBar\" place-under-sibling=\".some-toolbar\"\n    top-offset=\"1\">\n    <div id=\"big-content\">===== The start of sidebar =====\n      <rg-select options=\"item in []\"></rg-select>\n      <br/></div>\n  </rg-sidebar>\n  <div class=\"some-toolbar\">\n    Toolbar to place before sidebar\n    <rg-sidebar-toggle-button model=\"isShowSideBar\">Toggle sidebar\n    </rg-sidebar-toggle-button>\n  </div>\n</div>\n<div id=\"content-after\"></div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport angular from 'angular';\nimport SidebarNG from '@jetbrains/ring-ui/components/sidebar-ng/sidebar-ng';\nimport SelectNG from '@jetbrains/ring-ui/components/select-ng/select-ng';\n\nangular.module('foo', [SidebarNG, SelectNG]);\n\nvar bigContent = document.getElementById('big-content');\nvar after = document.getElementById('content-after');\n\nfor (var i=0; i< 100; i++) {\n  bigContent.innerHTML += ' ' + Math.random() + '<br/>';\n  after.innerHTML += ' ' + Math.random() + '<br/>';\n}\n\nbigContent.innerHTML += '===== The end of sidebar =====';\n  ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Provides an Angular wrapper for Sidebar.\nTo make sidebar have fixed positioning under some other element (e.g. toolbar),\na selector for that element should be passed as placeUnderSibling parameter.",
  "attrs": {
    "name": "Sidebar Ng",
    "category": "Legacy Angular",
    "description": "Provides an Angular wrapper for Sidebar.\nTo make sidebar have fixed positioning under some other element (e.g. toolbar),\na selector for that element should be passed as placeUnderSibling parameter.",
    "example-file": "./sidebar-ng.examples.html"
  }
};