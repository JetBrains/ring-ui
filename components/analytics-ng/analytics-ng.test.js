require('angular/angular');
require('angular-mocks/angular-mocks');
require('./analytics-ng');

describe('Ring.analytics', function() {
  beforeEach(
    window.module('Ring.analytics',
      function (analyticsProvider) {
        var send = sinon.stub();
        var AnalyticsCustomPlugin = require('../analytics/analytics__custom-plugin');
        analyticsProvider.plugins([new AnalyticsCustomPlugin(send)]);
      })
  );

  /* global inject, angular */
  it('should define module', inject(function() {
    expect(angular.module('Ring.analytics')).should.exist;
  }));

  it('should export factory', inject(function(analytics) {
    expect(analytics).should.exist;
  }));

  it('should export correct interface', inject(function(analytics) {
    expect(analytics.trackPageView).should.exist;
    expect(analytics.trackEvent).should.exist;
    expect(analytics.track).should.exist;
  }));

  describe('rgAnalytics', function() {
    var $rootScope;
    var $compile;
    var analytics;
    beforeEach(inject(function(_$rootScope_, _$compile_, _analytics_) {
      $rootScope = _$rootScope_;
      $compile = _$compile_;
      analytics = _analytics_;
      this.sinon.spy(analytics, 'trackEvent');
    }));

    var compileTemplate = function(template) {
      var elem = $compile(template)($rootScope);
      $rootScope.$digest();
      return elem;
    };

    it('should track event for full arguments list', function() {
      var elem = compileTemplate('<a href="someUrl" rg-analytics="some-category:some-event">Link</a>');
      elem.click();

      analytics.trackEvent.should.calledWith('some-category', 'some-event');
    });

    it('should track event (with empty event)', function() {
      var elem = compileTemplate('<a href="someUrl" rg-analytics="some-category">Link</a>');
      elem.click();

      analytics.trackEvent.should.calledWith('some-category', '');
    });

    it('should track event (with empty category)', function() {
      var elem = compileTemplate('<a href="someUrl" rg-analytics=":some-event">Link</a>');
      elem.click();

      analytics.trackEvent.should.calledWith('', 'some-event');
    });

    it('should track event for non-default user action)', function() {
      var elem = compileTemplate('<a href="someUrl" rg-analytics="category:expand" rg-analytics-on="blur">Link</a>');
      elem.blur();

      analytics.trackEvent.should.calledWith('category', 'expand');
    });
  });
});
