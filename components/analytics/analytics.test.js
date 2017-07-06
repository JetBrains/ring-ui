import analytics from './analytics';
import AnalyticsGAPlugin from './analytics__ga-plugin';
import AnalyticsCustomPlugin from './analytics__custom-plugin';

const Analytics = analytics.constructor;
const TICK_INTERVAL = 10500;
const MAX_PACK_SIZE = 100;
const FLUSH_INTERVAL = 10000;

describe('Analytics', () => {
  it('should be created', () => {
    analytics.should.exist;
  });

  it('should export correct interface', () => {
    analytics.trackPageView.should.exist;
    analytics.trackEvent.should.exist;
    analytics.trackShortcutEvent.should.exist;
    analytics.trackEntityProperties.should.exist;
    analytics.track.should.exist;
  });

  describe('ga plugin', () => {
    let gaPlugin;

    beforeEach(() => {
      Reflect.deleteProperty(window, 'ga');
      gaPlugin = new AnalyticsGAPlugin('SOME-ID');
    });

    it('should init ga', () => {
      window.ga.should.be.defined;
    });

    it('should export interface', () => {
      gaPlugin.trackPageView.should.exist;
      gaPlugin.trackEvent.should.exist;
    });

    it('should send pageview event', () => {
      const rememberGA = window.ga;
      window.ga = sandbox.spy();
      gaPlugin.trackPageView('some-path');

      window.ga.should.have.been.calledWith('send', 'pageview', 'some-path');

      window.ga = rememberGA;
    });

    it('should send action event', () => {
      const rememberGA = window.ga;
      window.ga = sandbox.spy();
      gaPlugin.trackEvent('some-category', 'some-action');

      window.ga.should.calledWith('send', 'event', {
        eventCategory: 'some-category',
        eventAction: 'some-action'
      });

      window.ga = rememberGA;
    });
  });

  describe('ga plugin with no key and in non-development mode', () => {
    let gaPlugin;

    beforeEach(() => {
      Reflect.deleteProperty(window, 'ga');
      gaPlugin = new AnalyticsGAPlugin();
    });

    it('should not init ga', () => {
      should.not.exist(window.ga);
      gaPlugin.trackEvent.should.be.function;
      gaPlugin.trackPageView.should.be.function;
    });
  });

  describe('tracking events', () => {
    let send;
    let clock;
    let analyticsInstance;
    beforeEach(() => {
      send = sandbox.spy();
      clock = sandbox.useFakeTimers();
      analyticsInstance = new Analytics();
    });

    describe('#enabled', () => {

      let customPlugin;
      beforeEach(() => {
        customPlugin = new AnalyticsCustomPlugin(send);
        analyticsInstance.config([customPlugin]);
      });

      it('should send request to statistics server on tracking event', () => {
        analyticsInstance.trackEvent('test-category', 'test-action');
        clock.tick(TICK_INTERVAL);

        send.should.have.been.calledWith([{
          category: 'test-category',
          action: 'test-action'
        }]);
      });

      it('should support configuration via method config', () => {
        const flushingFunction = sandbox.spy();
        customPlugin.config({
          send: flushingFunction
        });

        analyticsInstance.trackEvent('test-category', 'test-action');
        clock.tick(TICK_INTERVAL);

        send.should.not.have.been.called;
        flushingFunction.should.have.been.calledWith([{
          category: 'test-category',
          action: 'test-action'
        }]);
      });

      it('should send request on achieving max pack size', () => {
        for (let i = 0; i < MAX_PACK_SIZE - 1; ++i) {
          analyticsInstance.trackEvent(`test-category-${i}`, 'test-action');
        }
        customPlugin._data.length.should.equal(MAX_PACK_SIZE - 1);

        analyticsInstance.trackEvent('test-category-100', 'test-action');

        send.should.have.been.called;
        customPlugin._data.length.should.equal(0);
      });

      it('should configure max pack size via config', () => {
        customPlugin.config({
          send,
          flushMaxPackSize: MAX_PACK_SIZE + 2
        });

        for (let i = 0; i < MAX_PACK_SIZE + 1; ++i) {
          analyticsInstance.trackEvent(`test-category-${i}`, 'test-action');
        }
        customPlugin._data.length.should.equal(MAX_PACK_SIZE + 1);

        analyticsInstance.trackEvent('test-category-102', 'test-action');

        send.should.have.been.called;
        customPlugin._data.length.should.equal(0);
      });

      it('should remove prohibited symbols', () => {
        analyticsInstance.trackEvent('t/\\est-c,ate:gory*?', 't/\\est-a,ct:ion*?');
        clock.tick(TICK_INTERVAL);

        send.should.have.been.calledWith([{
          category: 't_est-c_ate_gory_',
          action: 't/_est-a_ct_ion_'
        }]);
      });

      it('should track event with additional information', () => {
        analyticsInstance.trackEvent('test-category', 'test-action', {type: 'test-type'});
        clock.tick(TICK_INTERVAL);

        send.should.have.been.calledWith([{
          category: 'test-category',
          action: 'test-action'
        }, {
          category: 'test-category',
          action: 'test-action__type$test-type'
        }]);
      });

      it('should send two events to statistics server on tracking shortcut event', () => {
        analyticsInstance.trackShortcutEvent('test-category', 'test-action');
        clock.tick(TICK_INTERVAL);

        send.should.have.been.calledWith([{
          category: 'test-category',
          action: 'test-action'
        }, {
          category: 'ring-shortcut',
          action: 'test-category$test-action'
        }]);
      });

      describe('trackEntityProperties', () => {
        it(
          'should send all enumerated properties to statistics server on tracking entity',
          () => {
            const entity = {
              param1: 'first',
              param2: 'second',
              param3: 'third',
              param4: 'fourth',
              param5: 'should-be-ignored'
            };
            const trackedProperties = ['param1', 'param2', 'param3', 'param4'];
            analyticsInstance.trackEntityProperties('sample-entity', entity, trackedProperties);
            clock.tick(TICK_INTERVAL);

            const trackedData = [];
            trackedProperties.forEach(it => {
              trackedData.push({
                category: 'sample-entity',
                action: `${it}__${entity[it]}`
              });
            });
            send.should.have.been.calledWith(trackedData);
          }
        );

        it('should not send any data if no properties requested', () => {
          const entity = {
            param1: 'first',
            param2: 'second'
          };
          analyticsInstance.trackEntityProperties('sample-entity', entity, []);
          clock.tick(TICK_INTERVAL);

          send.should.not.have.been.called;
        });

        it('should not throw error if there are no some properties', () => {
          const entity = {
            param1: 'first',
            param2: 'second'
          };
          analyticsInstance.
            trackEntityProperties('entity', entity, ['param1', 'nonexistent-property']);
          clock.tick(TICK_INTERVAL);

          send.should.have.been.calledWith([{
            category: 'entity',
            action: 'param1__first'
          }, {
            category: 'entity',
            action: 'nonexistent-property__no-value'
          }]);
        });

        it('should work with subproperties', () => {
          const entity = {
            property: {
              subproperty1: 'subproperty1-value',
              subproperty2: {
                subsubproperty: 'subsubproperty-value'
              }
            },
            param2: 'second'
          };
          const trackedProperties = [
            'property.subproperty2.subsubproperty',
            'property.subproperty3.nonexistent'
          ];
          analyticsInstance.trackEntityProperties('entity', entity, trackedProperties);
          clock.tick(TICK_INTERVAL);

          send.should.have.been.calledWith([{
            category: 'entity',
            action: 'property-subproperty2-subsubproperty__subsubproperty-value'
          }, {
            category: 'entity',
            action: 'property-subproperty3-nonexistent__no-value'
          }]);
        });
      });

      it('should send request to statistics server on page view', () => {
        analyticsInstance.trackPageView('test-page');
        clock.tick(TICK_INTERVAL);

        send.should.have.been.called;
      });

      it('should send request to statistics server multiple times', () => {
        //first loop
        analyticsInstance.trackPageView('test-page');
        clock.tick(TICK_INTERVAL);
        send.should.have.been.called;

        //second loop
        analyticsInstance.trackEvent('test-category', 'test-event');
        analyticsInstance.trackEvent('test-category-2', 'test-event-2');
        clock.tick(TICK_INTERVAL);
        send.should.calledWith([{
          category: 'test-category',
          action: 'test-event'
        }, {
          category: 'test-category-2',
          action: 'test-event-2'
        }
        ]);
      });

      describe('flushing restriction', () => {
        it('flushing should be allowed on second step', () => {
          let counter = 0;
          function flushingIsAllowedOnSecondCheck() {
            ++counter;
            // eslint-disable-next-line no-magic-numbers
            return counter === 2;
          }

          customPlugin = new AnalyticsCustomPlugin(
            send,
            false,
            FLUSH_INTERVAL,
            flushingIsAllowedOnSecondCheck
          );
          analyticsInstance.config([customPlugin]);

          analyticsInstance.trackEvent('test-category', 'test-action');
          clock.tick(TICK_INTERVAL);

          send.should.not.have.been.called;
          clock.tick(TICK_INTERVAL);

          send.should.have.been.calledWith([{
            category: 'test-category',
            action: 'test-action'
          }]);
        });
      });
    });
    describe('#disabled', () => {
      beforeEach(() => {
        analyticsInstance.config([]);
      });

      it('should not send request to statistics server', () => {
        analyticsInstance.trackEvent('test-category', 'test-action');
        clock.tick(TICK_INTERVAL);

        send.should.not.have.been.called;
      });
    });
  });
});
