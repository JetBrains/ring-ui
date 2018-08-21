window.source = {
  "title": "Query Assist Ng",
  "url": "query-assist-ng.html",
  "type": "js",
  "content": "/**\n * @name Query Assist Ng\n * @category Legacy Angular\n * @framework Angular\n * @description Provides an Angular wrapper for Query Assist.\n * @example-file ./query-assist-ng.examples.html\n */\nimport angularComponentFactory from '../global/angular-component-factory';\nimport QueryAssist from '../query-assist/query-assist';\n\nexport default angularComponentFactory(QueryAssist, 'QueryAssist').name;\n",
  "examples": [
    {
      "name": "Query Assist Ng",
      "url": "examples/query-assist-ng/query-assist-ng.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<div ng-app=\"test\" ng-strict-di ng-controller=\"testCtrl as ctrl\">\n  <button ng-click=\"ctrl.disabled = !ctrl.disabled\">Disable/Enable</button>\n\n  <div>\n    <p>{{ ctrl.query || 'no value' }}</p>\n\n    <rg-query-assist\n      x-clear=\"true\"\n      x-data-source=\"ctrl.source\"\n      x-disabled=\"ctrl.disabled\"\n      glass=\"true\"\n      focus=\"ctrl.focus\"\n      query=\"ctrl.query\"\n      on-apply=\"ctrl.save\"\n      on-change=\"ctrl.change\"\n      on-focus-change=\"ctrl.focusChange\"\n      placeholder=\"'placeholder'\"\n      hint=\"'Press ⇥ to complete first item'\"\n      hint-on-selection=\"'Press ↩ to complete selected item'\"></rg-query-assist>\n\n    <p ng-repeat=\"query in ctrl.queries track by $index\">{{ query }}</p>\n  </div>\n</div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport hubConfig from '@ring-ui/docs/components/hub-config';\n\nimport angular from 'angular';\nimport AuthNg from '@jetbrains/ring-ui/components/auth-ng/auth-ng';\nimport QueryAssistNg from '@jetbrains/ring-ui/components/query-assist-ng/query-assist-ng';\n\nangular.module('test', [QueryAssistNg, AuthNg]).config(function (authProvider) {\n  authProvider.config(hubConfig);\n}).controller('testCtrl', function ($http, $scope) {\n  const ctrl = this;\n  ctrl.queries = [];\n  ctrl.query = 'query';\n  ctrl.focus = true;\n  ctrl.disabled = true;\n\n  ctrl.save = function ({query}) {\n    ctrl.queries.unshift(query);\n  };\n\n  ctrl.change = function ({query}) {\n    ctrl.query = query;\n    console.log('ctrl.change:: Query = ', query);\n  };\n\n  ctrl.focusChange = function ({focus}) {\n    ctrl.focus = focus;\n  };\n\n  ctrl.source = function ({query, caret, omitSuggestions}) {\n    const config = {\n      params: {\n        fields: 'query,caret,styleRanges' + (omitSuggestions ? '' : ',suggestions'),\n        query: query,\n        caret: caret\n      }\n    };\n\n    return $http.get(hubConfig.serverUri + '/api/rest/users/queryAssist', config).\n      then(function (data) {\n        return data.data;\n      });\n  }\n});\n  ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Provides an Angular wrapper for Query Assist.",
  "attrs": {
    "name": "Query Assist Ng",
    "category": "Legacy Angular",
    "framework": "Angular",
    "description": "Provides an Angular wrapper for Query Assist.",
    "example-file": "./query-assist-ng.examples.html"
  }
};