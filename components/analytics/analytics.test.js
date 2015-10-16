describe('analytics singleton', function() {
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
      delete window.ga;
      gaPlugin = new AnalyticsGAPlugin('SOME-ID');
    });

    it('should init ga', function() {
      expect(window.ga).to.be.defined;
    });

    it('should export interface', function() {
      expect(gaPlugin.trackPageView).should.exist;
      expect(gaPlugin.trackEvent).should.exist;
    });

    it('should send pageview event', function() {
      var rememberGA = window.ga;
      window.ga = this.sinon.spy();
      gaPlugin.trackPageView('some-path');

      window.ga.should.have.been.calledWith('send', 'pageview', 'some-path');

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

  describe('ga plugin with no key and in non-development mode', function() {
    var gaPlugin;
    beforeEach(function() {
      delete window.ga;
      gaPlugin = new AnalyticsGAPlugin();
    });

    it('should not init ga', function() {
      expect(window.ga).to.be.undefined;
      expect(gaPlugin.trackEvent).to.be.function;
      expect(gaPlugin.trackPageView).to.be.function;
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

        send.should.have.been.calledWith([{
          category: 'test-category',
          action: 'test-action'
        }]);
      });

      it('should remove prohibited symbols', function() {
        analytics.trackEvent('t/\\est-c,ate:gory*?', 't/\\est-a,ct:ion*?');
        clock.tick(10500);

        send.should.have.been.calledWith([{
          category: 't_est-c_ate_gory_',
          action: 't/_est-a_ct_ion_'
        }]);
      });

      it('should track event with additional information', function() {
        analytics.trackEvent('test-category', 'test-action', {type: 'test-type'});
        clock.tick(10500);

        send.should.have.been.calledWith([{
          category: 'test-category',
          action: 'test-action'
        }, {
          category: 'test-category',
          action: 'test-action__type$test-type'
        }]);
      });

      it('should send two events to statistics server on tracking shortcut event', function() {
        analytics.trackShortcutEvent('test-category', 'test-action');
        clock.tick(10500);

        send.should.have.been.calledWith([{
          category: 'test-category',
          action: 'test-action'
        }, {
          category: 'ring-shortcut',
          action: 'test-category$test-action'
        }]);
      });

      describe('trackEntityProperties', function() {
        it('should send all enumerated properties to statistics server on tracking entity', function() {
          var entity = {
            param1: 'first',
            param2: 'second',
            param3: 'third',
            param4: 'fourth',
            param5: 'should-be-ignored'
          };
          var trackedProperties = ['param1', 'param2', 'param3', 'param4'];
          analytics.trackEntityProperties('sample-entity', entity, trackedProperties);
          clock.tick(10500);

          var trackedData = [];
          trackedProperties.forEach(function(it) {
            trackedData.push({
              category: 'sample-entity',
              action: it + '__' + entity[it]
            });
          });
          send.should.have.been.calledWith(trackedData);
        });

        it('should not send any data if no properties requested', function() {
          var entity = {
            param1: 'first',
            param2: 'second'
          };
          analytics.trackEntityProperties('sample-entity', entity, []);
          clock.tick(10500);

          send.should.not.have.been.called;
        });

        it('should not throw error if there are no some properties', function() {
          var entity = {
            param1: 'first',
            param2: 'second'
          };
          analytics.trackEntityProperties('entity', entity, ['param1', 'unexisting-property']);
          clock.tick(10500);

          send.should.have.been.calledWith([{
            category: 'entity',
            action: 'param1__first'
          }, {
            category: 'entity',
            action: 'unexisting-property__no-value'
          }]);
        });

        it('should work with subproperties', function() {
          var entity = {
            property: {
              subproperty1: 'subproperty1-value',
              subproperty2: {
                subsubproperty: 'subsubproperty-value'
              }
            },
            param2: 'second'
          };
          var trackedProperies = [
            'property.subproperty2.subsubproperty',
            'propery.subproperty3.unexisting'
          ];
          analytics.trackEntityProperties('entity', entity, trackedProperies);
          clock.tick(10500);

          send.should.have.been.calledWith([{
            category: 'entity',
            action: 'property-subproperty2-subsubproperty__subsubproperty-value'
          }, {
            category: 'entity',
            action: 'propery-subproperty3-unexisting__no-value'
          }]);
        });
      });

      it('should send request to statistics server on page view', function() {
        analytics.trackPageView('test-page');
        clock.tick(10500);

        send.should.have.been.called;
      });

      it('should send request to statistics server multiple times', function() {
        //first loop
        analytics.trackPageView('test-page');
        clock.tick(10500);
        send.should.have.been.called;

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

      describe('flushing restriction', function() {
        it('flushing should be allowed on second step', function () {
          var counter = 0;
          var flushingIsAllowedOnSecondCheck = function() {
            ++counter;
            return counter === 2;
          };

          var customPlugin = new AnalyticsCustomPlugin(send, false, 10000, flushingIsAllowedOnSecondCheck);
          analytics.config([customPlugin]);

          analytics.trackEvent('test-category', 'test-action');
          clock.tick(10500);

          send.should.not.have.been.called;
          clock.tick(10500);

          send.should.have.been.calledWith([{
            category: 'test-category',
            action: 'test-action'
          }]);
        });
      });
    });
    describe('#disabled', function() {
      beforeEach(function() {
        analytics.config([]);
      });

      it('should not send request to statistics server', function() {
        analytics.trackEvent('test-category', 'test-action');
        clock.tick(10500);

        send.should.not.have.been.called;
      });
    });
  });
});
