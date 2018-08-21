window.source = {
  "title": "Tabs Ng",
  "url": "tabs-ng.html",
  "type": "js",
  "content": "import angular from 'angular';\nimport className from 'classnames';\n\nimport styles from '../tabs/tabs.css';\nimport Theme from '../global/theme';\n\n/**\n * @name Tabs Ng\n * @category Legacy Angular\n * @tags Ring UI Language\n * @description Displays a tabset.\n * @example-file ./tabs-ng.examples.html\n */\n\nconst angularModule = angular.module('Ring.tabs', []);\n\nangularModule.directive('rgTabs', function rgTabsDirective($location, $rootScope) {\n  return {\n    restrict: 'E',\n    transclude: true,\n    template: require('./tabs-ng.html'),\n    replace: true,\n\n    scope: {\n      tabParameter: '@',\n      tabsClass: '=',\n      control: '=?',\n      disableLocationChanging: '=',\n      theme: '@?'\n    },\n\n    controller: function controller($scope) {\n      $scope.panes = [];\n      $scope.current = null;\n      $scope.styles = styles;\n      $scope.theme = $scope.theme || Theme.LIGHT;\n\n      function getTabIdFromUrl() {\n        return $location.search()[$scope.tabParameter];\n      }\n\n      function doSelect(newPane, skipUrlUpdate) {\n        if (newPane === $scope.current || newPane.ngDisabled) {\n          return;\n        }\n\n        for (let index = 0; index < $scope.panes.length; index++) {\n          const pane = $scope.panes[index];\n\n          // Update current tab\n          if (pane === newPane || pane.tabId === newPane) {\n            $scope.current = newPane;\n            pane.selected = true;\n\n            if (!skipUrlUpdate) {\n              $location.search($scope.tabParameter, newPane.tabId);\n            }\n          } else { // Deselect all other\n            pane.selected = false;\n          }\n        }\n      }\n\n      function getNextPaneIndex(reverseOrder) {\n        const currentTabIndex = $scope.panes.indexOf($scope.current);\n        let next = currentTabIndex;\n\n        do {\n          next += (reverseOrder ? -1 : 1);\n        } while (next > -1 && next < $scope.panes.length && $scope.panes[next].ngDisabled);\n\n        if (next >= $scope.panes.length) {\n          next = $scope.panes.length - 1;\n        } else if (next < 0) {\n          next = 0;\n        }\n\n        // if no suitable tab found till the end of array\n        if ($scope.panes[next].ngDisabled) {\n          return currentTabIndex;\n        }\n\n        return next;\n      }\n\n      function getCurrentTab() {\n        const currentTabId = getTabIdFromUrl();\n\n        if (currentTabId) {\n          const currentTab = $scope.panes.find(pane => pane.tabId === currentTabId);\n\n          if (currentTab && !currentTab.ngDisabled) {\n            return currentTab;\n          } else {\n            return $scope.panes[getNextPaneIndex()];\n          }\n        } else {\n          return $scope.panes[0];\n        }\n      }\n\n      // controller methods\n\n      function checkCurrentTab() {\n        if ($scope.panes.length) {\n          doSelect(getCurrentTab(), true);\n        }\n      }\n\n      this.addTab = tab => {\n        $scope.panes.push(tab);\n\n        if ($scope.panes.length === 1 || tab.tabId === getTabIdFromUrl()) {\n          doSelect(tab, true);\n        }\n      };\n\n      this.removeTab = tab => {\n        const index = $scope.panes.indexOf(tab);\n\n        $scope.panes.splice(index, 1);\n        checkCurrentTab();\n      };\n\n      this.checkPane = checkCurrentTab;\n\n      // scope\n\n      $scope.$on('$destroy', $rootScope.$on('$routeUpdate', checkCurrentTab));\n\n      // Exposed methods\n      $scope.control = {};\n\n      $scope.control.isLast =\n        () => $scope.panes.indexOf($scope.current) === $scope.panes.length - 1;\n\n      $scope.control.isFirst = () => $scope.panes.indexOf($scope.current) === 0;\n\n      $scope.control.select = pane => {\n        doSelect(pane, $scope.disableLocationChanging);\n      };\n\n      $scope.control.next = () => {\n        const next = getNextPaneIndex();\n        doSelect($scope.panes[next], $scope.disableLocationChanging);\n      };\n\n      $scope.control.prev = () => {\n        const prev = getNextPaneIndex(true);\n        doSelect($scope.panes[prev], $scope.disableLocationChanging);\n      };\n\n      $scope.keyMap = {\n        next: $scope.control.next,\n        prev: $scope.control.prev,\n        focus: () => {\n          $scope.focus = !$scope.focus;\n          return !$scope.focus;\n        }\n      };\n\n      // For some reason ng-class doesn't work properly on tabs.\n      // From time to time several tabs look like selected despite correct scope state.\n      // I think this bug depends on the frequency of addTab calls (actually on digests)\n      // and ng-class detection of added and removed classes becomes broken.\n      // @maxim.erekhinskiy\n      $scope.tabClass = pane => className(styles.title, {\n        [styles.selected]: pane.selected\n      });\n\n      this.$onInit = () => {\n        if (!$scope.tabParameter) {\n          $scope.tabParameter = 'tab';\n        }\n      };\n    }\n  };\n});\n\nangularModule.directive('rgTabsPane', function rgTabsPaneDirective() {\n  return {\n    require: '^rgTabs',\n    restrict: 'E',\n    transclude: true,\n\n    scope: {\n      title: '@',\n      counter: '@',\n      tabId: '@?',\n      tabIndex: '@?',\n      selected: '=?',\n      ngDisabled: '=?'\n    },\n\n    link: function link(scope, element, attrs, tabsCtrl) {\n      scope.tabId = scope.tabId || scope.title.toLowerCase().replace(' ', '-');\n      scope.tabIndex = scope.tabIndex ? +scope.tabIndex : 0;\n\n      tabsCtrl.addTab(scope);\n\n      scope.$on('$destroy', () => {\n        tabsCtrl.removeTab(scope);\n      });\n    },\n\n    template: '<div class=\"ring-tabs__content\" ng-class=\"{\\'ring-tabs__content_active\\':selected}\" ng-if=\"selected\" ng-transclude></div>'\n  };\n});\n\nexport default angularModule.name;\n",
  "examples": [
    {
      "name": "Tabs Ng",
      "url": "examples/tabs-ng/tabs-ng.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "html",
          "content": "\n<div ng-app=\"Ring.tabs\" ng-strict-di>\n  <rg-tabs class=\"container container_tabs\">\n    <rg-tabs-pane x-title=\"Settings\">Settings tab content</rg-tabs-pane>\n    <rg-tabs-pane x-title=\"Access\" counter=\"7\">Access tab content</rg-tabs-pane>\n    <rg-tabs-pane x-title=\"Disabled\" ng-disabled=\"true\" counter=\"8\">Inaccessible tab content</rg-tabs-pane>\n    <rg-tabs-pane x-title=\"Members\">Members tab content</rg-tabs-pane>\n    <rg-tabs-pane x-title=\"Members\" counter=\"666\">Members 666 tab content</rg-tabs-pane>\n  </rg-tabs>\n</div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport angular from 'angular';\nimport '@jetbrains/ring-ui/components/tabs-ng/tabs-ng';\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Tabs Ng Dark",
      "url": "examples/tabs-ng/tabs-ng-dark.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "css",
          "content": "\n:global(body) {\n  background: #000;\n}\n  ",
          "showCode": true
        },
        {
          "type": "html",
          "content": "\n<div ng-app=\"Ring.tabs\" ng-strict-di>\n  <rg-tabs class=\"container container_tabs\" theme=\"dark\">\n    <rg-tabs-pane x-title=\"Settings\">Settings tab content</rg-tabs-pane>\n    <rg-tabs-pane x-title=\"Access\" counter=\"7\">Access tab content</rg-tabs-pane>\n    <rg-tabs-pane x-title=\"Disabled\" ng-disabled=\"true\" counter=\"8\">Inaccessible tab content</rg-tabs-pane>\n    <rg-tabs-pane x-title=\"Members\">Members tab content</rg-tabs-pane>\n    <rg-tabs-pane x-title=\"Members\" counter=\"666\">Members 666 tab content</rg-tabs-pane>\n  </rg-tabs>\n</div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport angular from 'angular';\nimport '@jetbrains/ring-ui/components/tabs-ng/tabs-ng';\n  ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Displays a tabset.",
  "attrs": {
    "name": "Tabs Ng",
    "category": "Legacy Angular",
    "tags": "Ring UI Language",
    "description": "Displays a tabset.",
    "example-file": "./tabs-ng.examples.html"
  }
};