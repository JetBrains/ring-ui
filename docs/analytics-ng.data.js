window.source = {
  "title": "Analytics Ng",
  "url": "analytics-ng.html",
  "type": "js",
  "content": "import angular from 'angular';\n\nimport analyticsInstance from '../analytics/analytics';\nimport AnalyticsGAPlugin from '../analytics/analytics__ga-plugin';\nimport AnalyticsCustomPlugin from '../analytics/analytics__custom-plugin';\n\n/**\n * @name Analytics Ng\n * @category Legacy Angular\n * @tags Ring UI Language\n * @description Provides an Angular wrapper for Analytics.\n * @example\n   <example name=\"Analytics Ng\">\n     <file name=\"index.js\">\n       import angular from 'angular';\n       import AnalyticsNG from '@jetbrains/ring-ui/components/analytics-ng/analytics-ng';\n       import LinkNG from '@jetbrains/ring-ui/components/link-ng/link-ng';\n\n        angular.module('Example.analyticsDemo', [AnalyticsNG, LinkNG])\n          .config([\n            'analyticsProvider',\n            'AnalyticsCustomPlugin',\n            'AnalyticsGAPlugin',\n            function(analyticsProvider, AnalyticsCustomPlugin, AnalyticsGAPlugin) {\n              var analyticsEnabled = true;\n              if (analyticsEnabled) {\n                var isDevelopment = true;\n                var customPlugin = new AnalyticsCustomPlugin(function(data) {\n                  console.log('Here you can send data to server', data);\n                }, isDevelopment, 600);\n                var gaId; // = 'GA-XXXXX-ID';\n                analyticsProvider.plugins([\n                  customPlugin //, new AnalyticsGAPlugin(gaId)\n                ]);\n              }\n            }\n          ])\n\n          .controller('TrackEventDemoCtrl', [\n            'analytics',\n            function(analytics) {\n              analytics.trackEvent('track-event-demo', 'show');\n            }\n          ]);\n     </file>\n     <file name=\"index.html\">\n       <div ng-app=\"Example.analyticsDemo\" ng-strict-di>\n        <p>Hover or click the links below and check the console output:</p>\n        <div>\n          <rg-link href=\"\" rg-analytics=\"overview:view-doc\">\n            Link with an onclick analytics trigger\n          </rg-link>\n        </div>\n        <div>\n          <rg-link href=\"\" rg-analytics=\"overview:view-doc\" rg-analytics-on=\"mouseover\">\n            Link with an onmouseover analytics trigger\n          </rg-link>\n        </div>\n        <div ng-controller=\"TrackEventDemoCtrl\"></div>\n       </div>\n     </file>\n   </example>\n*/\n\nconst angularModule = angular.module('Ring.analytics', []);\n\n/**\n * @name analyticsProvider\n * @description Configures analytics with plugins.\n */\nangularModule.provider('analytics', function provider() {\n  let configPlugins = [];\n  /**\n   * @param plugins\n   */\n  this.plugins = plugins => {\n    configPlugins = plugins;\n  };\n\n  this.$get = function get($log, $injector) {\n    const loadedPlugins = [];\n    for (let i = 0; i < configPlugins.length; ++i) {\n      if (typeof configPlugins[i] === 'string') {\n        try {\n          const plugin = $injector.get(configPlugins[i]);\n          loadedPlugins.push(plugin);\n          $log.debug(`analytics: loaded plugin ${configPlugins[i]}`);\n        } catch (err) {\n          $log.debug(`analytics: unable to load factory ${configPlugins[i]}`);\n        }\n      } else {\n        loadedPlugins.push(configPlugins[i]);\n      }\n    }\n    analyticsInstance.config(loadedPlugins);\n    return analyticsInstance;\n  };\n});\n\nangularModule.constant('AnalyticsGAPlugin', AnalyticsGAPlugin);\nangularModule.constant('AnalyticsCustomPlugin', AnalyticsCustomPlugin);\n\n/**\n * Enable page tracking\n */\nangularModule.run(function analyticsRun($rootScope, analytics) {\n  $rootScope.$on('$routeChangeSuccess', (evt, current) => { // eslint-disable-line angular/on-watch\n    /* eslint-disable angular/no-private-call */\n    if (current && current.$$route && current.$$route.originalPath) {\n      analytics.trackPageView(current.$$route.originalPath);\n    }\n    /* eslint-enable angular/no-private-call */\n  });\n});\n\n/**\n *  @ngdoc directive\n *  @name rg-analytics\n *\n *  @description\n *  The `rg-analytics=\"<categoryName>:<eventName>\"` sends categoryName and eventName to analytics server on\n *  user action, specified via attribute `rg-analytics-on` (e.g. rg-analytics-on='mouseover' means that analytics will be sent on mouseover,\n *  rg-analytics-on='click' - on click). If there is no attribute rg-analytics-on, the default value 'click' is used.\n */\nangularModule.directive('rgAnalytics', function rgAnalyticsDirective(analytics) {\n  return {\n    restrict: 'A',\n    replace: false,\n\n    link: function link($scope, elem) {\n      const eventType = elem.attr('rg-analytics-on') || 'click';\n      angular.element(elem).bind(eventType, () => {\n        analytics.track(elem.attr('rg-analytics'));\n      });\n    }\n  };\n});\n\nexport default angularModule.name;\n",
  "examples": [
    {
      "name": "Analytics Ng",
      "url": "examples/analytics-ng/analytics-ng.html",
      "disableAutoSize": false,
      "files": [
        {
          "type": "js",
          "content": "\nimport angular from 'angular';\nimport AnalyticsNG from '@jetbrains/ring-ui/components/analytics-ng/analytics-ng';\nimport LinkNG from '@jetbrains/ring-ui/components/link-ng/link-ng';\n\n angular.module('Example.analyticsDemo', [AnalyticsNG, LinkNG])\n   .config([\n     'analyticsProvider',\n     'AnalyticsCustomPlugin',\n     'AnalyticsGAPlugin',\n     function(analyticsProvider, AnalyticsCustomPlugin, AnalyticsGAPlugin) {\n       var analyticsEnabled = true;\n       if (analyticsEnabled) {\n         var isDevelopment = true;\n         var customPlugin = new AnalyticsCustomPlugin(function(data) {\n           console.log('Here you can send data to server', data);\n         }, isDevelopment, 600);\n         var gaId; // = 'GA-XXXXX-ID';\n         analyticsProvider.plugins([\n           customPlugin //, new AnalyticsGAPlugin(gaId)\n         ]);\n       }\n     }\n   ])\n\n   .controller('TrackEventDemoCtrl', [\n     'analytics',\n     function(analytics) {\n       analytics.trackEvent('track-event-demo', 'show');\n     }\n   ]);\n     ",
          "showCode": true
        },
        {
          "type": "html",
          "content": "\n<div ng-app=\"Example.analyticsDemo\" ng-strict-di>\n <p>Hover or click the links below and check the console output:</p>\n <div>\n   <rg-link href=\"\" rg-analytics=\"overview:view-doc\">\n     Link with an onclick analytics trigger\n   </rg-link>\n </div>\n <div>\n   <rg-link href=\"\" rg-analytics=\"overview:view-doc\" rg-analytics-on=\"mouseover\">\n     Link with an onmouseover analytics trigger\n   </rg-link>\n </div>\n <div ng-controller=\"TrackEventDemoCtrl\"></div>\n</div>\n     ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Provides an Angular wrapper for Analytics.",
  "attrs": {
    "name": "Analytics Ng",
    "category": "Legacy Angular",
    "tags": "Ring UI Language",
    "description": "Provides an Angular wrapper for Analytics.",
    "example": "   <example name=\"Analytics Ng\">\n     <file name=\"index.js\">\n       import angular from 'angular';\n       import AnalyticsNG from '@jetbrains/ring-ui/components/analytics-ng/analytics-ng';\n       import LinkNG from '@jetbrains/ring-ui/components/link-ng/link-ng';\n\n        angular.module('Example.analyticsDemo', [AnalyticsNG, LinkNG])\n          .config([\n            'analyticsProvider',\n            'AnalyticsCustomPlugin',\n            'AnalyticsGAPlugin',\n            function(analyticsProvider, AnalyticsCustomPlugin, AnalyticsGAPlugin) {\n              var analyticsEnabled = true;\n              if (analyticsEnabled) {\n                var isDevelopment = true;\n                var customPlugin = new AnalyticsCustomPlugin(function(data) {\n                  console.log('Here you can send data to server', data);\n                }, isDevelopment, 600);\n                var gaId; // = 'GA-XXXXX-ID';\n                analyticsProvider.plugins([\n                  customPlugin //, new AnalyticsGAPlugin(gaId)\n                ]);\n              }\n            }\n          ])\n\n          .controller('TrackEventDemoCtrl', [\n            'analytics',\n            function(analytics) {\n              analytics.trackEvent('track-event-demo', 'show');\n            }\n          ]);\n     </file>\n     <file name=\"index.html\">\n       <div ng-app=\"Example.analyticsDemo\" ng-strict-di>\n        <p>Hover or click the links below and check the console output:</p>\n        <div>\n          <rg-link href=\"\" rg-analytics=\"overview:view-doc\">\n            Link with an onclick analytics trigger\n          </rg-link>\n        </div>\n        <div>\n          <rg-link href=\"\" rg-analytics=\"overview:view-doc\" rg-analytics-on=\"mouseover\">\n            Link with an onmouseover analytics trigger\n          </rg-link>\n        </div>\n        <div ng-controller=\"TrackEventDemoCtrl\"></div>\n       </div>\n     </file>\n   </example>"
  }
};