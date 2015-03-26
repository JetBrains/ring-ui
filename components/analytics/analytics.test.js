describe.only('analytics singleton', function() {
  var analytics = require('./analytics');
  var AnalyticsGAPlugin = require('./analytics__ga-plugin');
  var AnalyticsCustomPlugin = require('./analytics__custom-plugin');
  var Analytics = analytics.constructor;

  it('should be created', function() {
    expect(analytics).should.exist;
  });

  it('should export correct interface', function() {
    expect(analytics.trackPageView).should.exist;
    expect(analytics.trackEvent).should.exist;
    expect(analytics.trackShortcutEvent).should.exist;
    expect(analytics.trackEntityProperties).should.exist;
    expect(analytics.track).should.exist;
  });

  describe('ga plugin', function() {
    var gaPlugin;
    beforeEach(function() {
      gaPlugin = new AnalyticsGAPlugin();
    });

    it('should init ga', function() {
      expect(window.ga).should.exist;
    });

    it('should export interface', function() {
      expect(gaPlugin.trackPageView).should.exist;
      expect(gaPlugin.trackEvent).should.exist;
    });

    it('should send pageview event', function() {
      var rememberGA = window.ga;
      window.ga = this.sinon.spy();
      gaPlugin.trackPageView('some-path');

      window.ga.should.calledWith('send', 'pageview', 'some-path');

      window.ga = rememberGA;
    });

    it('should send action event', function() {
      var rememberGA = window.ga;
      window.ga = this.sinon.spy();
      gaPlugin.trackEvent('some-category', 'some-action');

      window.ga.should.calledWith('send', 'event', {
        eventCategory: 'some-category',
        eventAction: 'some-action'
      });

      window.ga = rememberGA;
    });
  });

  describe('tracking events', function() {
    var send;
    var clock;
    beforeEach(function() {
      send = this.sinon.spy();
      clock = this.sinon.useFakeTimers();
      analytics = new Analytics();
    });

    describe('#enabled', function() {
      beforeEach(function() {
        var customPlugin = new AnalyticsCustomPlugin(send);
        analytics.config([customPlugin]);
      });

      it('should send request to statistics server on tracking event', function() {
        analytics.trackEvent('test-category', 'test-action');
        clock.tick(10500);

        send.should.calledWith([{
          category: 'test-category',
          action: 'test-action'
        }]);
      });

      it('should send request to statistics server on page view', function() {
        analytics.trackPageView('test-page');
        clock.tick(10500);

        send.should.called;
      });

      it('should send request to statistics server multiple times', function() {
        //first loop
        analytics.trackPageView('test-page');
        clock.tick(10500);
        send.should.called;

        //second loop
        analytics.trackEvent('test-category', 'test-event');
        analytics.trackEvent('test-category-2', 'test-event-2');
        clock.tick(10500);
        send.should.calledWith([{
          category: 'test-category',
          action: 'test-event'
        }, {
          category: 'test-category-2',
          action: 'test-event-2'
        }
        ]);
      });
    });
    describe('#disabled', function() {
      beforeEach(function() {
        analytics.config([]);
      });

      it('should not send request to statistics server', function() {
        analytics.trackEvent('test-category', 'test-action');
        clock.tick(10500);

        send.should.not.called;
      });
    });
  });
});
