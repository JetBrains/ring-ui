import angular from 'angular';
import 'angular-mocks';

import AnalyticsCustomPlugin from '../analytics/analytics__custom-plugin';

import Analytics from './analytics-ng';

describe('Analytics Ng', () => {
  beforeEach(
    window.module('Ring.analytics',
      analyticsProvider => {
        const send = sandbox.stub();
        analyticsProvider.plugins([new AnalyticsCustomPlugin(send)]);
      })
  );

  /* global inject */
  it('should define module', inject(() => {
    angular.module(Analytics).should.exist;
  }));

  it('should export factory', inject(analytics => {
    analytics.should.exist;
  }));

  it('should export correct interface', inject(analytics => {
    analytics.trackPageView.should.exist;
    analytics.trackEvent.should.exist;
    analytics.track.should.exist;
  }));

  describe('rgAnalytics', () => {
    let $rootScope;
    let $compile;
    let analytics;

    beforeEach(inject((_$rootScope_, _$compile_, _analytics_) => {
      $rootScope = _$rootScope_;
      $compile = _$compile_;
      analytics = _analytics_;
      sandbox.spy(analytics, 'trackEvent');
    }));

    function compileTemplate(template) {
      const elem = $compile(template)($rootScope);
      $rootScope.$digest();
      return elem;
    }

    const click = new CustomEvent('click');

    it('should track event for full arguments list', () => {
      const elem = compileTemplate('<a href="#" rg-analytics="some-category:some-event">Link</a>');
      elem[0].dispatchEvent(click);

      analytics.trackEvent.should.calledWith('some-category', 'some-event');
    });

    it('should track event (with empty event)', () => {
      const elem = compileTemplate('<a href="#" rg-analytics="some-category">Link</a>');
      elem[0].dispatchEvent(click);

      analytics.trackEvent.should.calledWith('some-category', '');
    });

    it('should track event (with empty category)', () => {
      const elem = compileTemplate('<a href="#" rg-analytics=":some-event">Link</a>');
      elem[0].dispatchEvent(click);

      analytics.trackEvent.should.calledWith('', 'some-event');
    });

    it('should track event for non-default user action)', () => {
      const elem = compileTemplate(
        '<a href="#" rg-analytics="category:expand" rg-analytics-on="blur">Link</a>'
      );
      elem[0].dispatchEvent(new CustomEvent('blur'));

      analytics.trackEvent.should.calledWith('category', 'expand');
    });
  });
});
