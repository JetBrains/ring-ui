describe('analytics singleton', function() {
  var analytics = require('./analytics');
  var Analytics = analytics.constructor;

  it('should be created', function() {
    expect(analytics).should.exist;
  });

  it('should export correct interface', function() {
    expect(analytics.trackPageView).should.exist;
    expect(analytics.trackEvent).should.exist;
    expect(analytics.track).should.exist;
  });

  describe('tracking events', function() {
    var send;
    var clock;
    beforeEach(function() {
      send = this.sinon.spy();
      clock = this.sinon.useFakeTimers();
      analytics = new Analytics();
    });

    afterEach(function() {
      clock.restore();
    });

    describe('#enabled', function() {
      beforeEach(function() {
        analytics.config({
          analyticsIsAllowed: true,
          send: send
        });
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
        analytics.config({
          analyticsIsAllowed: false,
          send: send
        });
      });

      it('should not send request to statistics server', function() {
        analytics.trackEvent('test-category', 'test-action');
        clock.tick(10500);

        send.should.not.called;
      });
    });
  });
});
