'use strict';

var analytics = require('analytics/analytics');

/* global angular: false */
var analyticsModule = angular.module('Ring.analytics', []);

analyticsModule.provider('analytics', [function() {
  var analyticsConfig = {};
  /**
   * @param {{
   *   send: function,
   *   initGA: boolean?
   *   isDevelopment: boolean?
   *   analyticsIsAllowed: boolean?
   * }} config
   */
  this.config = function(config) {
    analyticsConfig = config;
  };

  this.$get = ['$injector', '$log', function($injector, $log) {
    if (typeof analyticsConfig.send === 'string') {
      try {
        analyticsConfig.send = $injector.get(analyticsConfig.send);
      } catch (err) {
        $log.debug('analytics: unable to load factory' + analyticsConfig.send);
        analyticsConfig.send = angular.noop;
      }
    }
    analytics.config(analyticsConfig);
    return analytics;
  }];
}]);

/**
 * Enable page tracking
 */
analyticsModule.run(['$rootScope', 'analytics', function($rootScope, analytics) {
  $rootScope.$on('$routeChangeSuccess', function(evt, current) {
    analytics.trackPageView(current.$$route.originalPath);
  });
}]);

/**
 *  @ngdoc directive
 *  @name rg-analytics
 *
 *  @description
 *  The `rg-analytics="<categoryName>:<eventName>"` sends categoryName and eventName to analytics server on
 *  user action, specified via attribute `rg-analytics-on` (e.g. rg-analytics-on='mouseover' means that analytics will be send on mouseover,
 *  rg-analytics-on='click' - on click). If there is no attribute rg-analytics-on, the default value 'click' is used.
 *
 *  @example
 *  <doc:example>
 *   <doc:source>
 *    <a href="someLink" rg-analytics="overview:view-doc">Link-with-on-click-analytic</a>
 *    <a href="someLink" rg-analytics="overview:view-doc" rg-analytics-on="mouseover">Link-with-on-mouseover-analytic</a>
 *   </doc:source>
 *  </doc:example>
 */
analyticsModule.directive('rgAnalytics', [
  'analytics',
  function(analytics) {
    return {
      restrict: 'A',
      replace: false,

      link: function($scope, elem) {
        var eventType = elem.attr('rg-analytics-on') || 'click';
        angular.element(elem).bind(eventType, function() {
          analytics.track(elem.attr('rg-analytics'));
        });
      }
    };
  }
]);

module.exports = analyticsModule;
