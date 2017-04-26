/* eslint-disable func-names */

import analytics from './analytics';
import AnalyticsGAPlugin from './analytics__ga-plugin';
import AnalyticsCustomPlugin from './analytics__custom-plugin';

const Analytics = analytics.constructor;

describe('Analytics', () => {
  it('should be created', () => {
    expect(analytics).should.exist;
  });

  it('should export correct interface', () => {
    expect(analytics.trackPageView).should.exist;
    expect(analytics.trackEvent).should.exist;
    expect(analytics.trackShortcutEvent).should.exist;
    expect(analytics.trackEntityProperties).should.exist;
    expect(analytics.track).should.exist;
  });

  describe('ga plugin', () => {
    let gaPlugin;

    beforeEach(() => {
      Reflect.deleteProperty(window, 'ga');
      gaPlugin = new AnalyticsGAPlugin('SOME-ID');
    });

    it('should init ga', () => {
      expect(window.ga).to.be.defined;
    });

    it('should export interface', () => {
      expect(gaPlugin.trackPageView).should.exist;
      expect(gaPlugin.trackEvent).should.exist;
    });

    it('should send pageview event', function () {
      const rememberGA = window.ga;
      window.ga = this.sinon.spy();
      gaPlugin.trackPageView('some-path');

      window.ga.should.have.been.calledWith('send', 'pageview', 'some-path');

      window.ga = rememberGA;
    });

    it('should send action event', function () {
      const rememberGA = window.ga;
      window.ga = this.sinon.spy();
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
      expect(window.ga).to.be.undefined;
      expect(gaPlugin.trackEvent).to.be.function;
      expect(gaPlugin.trackPageView).to.be.function;
    });
  });

  describe('tracking events', () => {
    beforeEach(function () {
      this.send = this.sinon.spy();
      this.clock = this.sinon.useFakeTimers();
      this.analytics = new Analytics();
    });

    describe('#enabled', () => {

      let customPlugin;
      beforeEach(function () {
        customPlugin = new AnalyticsCustomPlugin(this.send);
        this.analytics.config([customPlugin]);
      });

      it('should send request to statistics server on tracking event', function () {
        this.analytics.trackEvent('test-category', 'test-action');
        this.clock.tick(10500);

        this.send.should.have.been.calledWith([{
          category: 'test-category',
          action: 'test-action'
        }]);
      });

      it('should support configuration via method config', function () {
        const flushingFunction = this.sinon.spy();
        customPlugin.config({
          send: flushingFunction
        });

        this.analytics.trackEvent('test-category', 'test-action');
        this.clock.tick(10500);

        this.send.should.not.have.been.called;
        flushingFunction.should.have.been.calledWith([{
          category: 'test-category',
          action: 'test-action'
        }]);
      });

      it('should send request on achieving max pack size', function () {
        for (let i = 0; i < 99; ++i) {
          this.analytics.trackEvent(`test-category-${i}`, 'test-action');
        }
        expect(customPlugin._data.length).equal(99);

        this.analytics.trackEvent('test-category-100', 'test-action');

        this.send.should.have.been.called;
        expect(customPlugin._data.length).equal(0);
      });

      it('should configure max pack size via config', function () {
        customPlugin.config({
          send: this.send,
          flushMaxPackSize: 102
        });

        for (let i = 0; i < 101; ++i) {
          this.analytics.trackEvent(`test-category-${i}`, 'test-action');
        }
        expect(customPlugin._data.length).equal(101);

        this.analytics.trackEvent('test-category-102', 'test-action');

        this.send.should.have.been.called;
        expect(customPlugin._data.length).equal(0);
      });

      it('should remove prohibited symbols', function () {
        this.analytics.trackEvent('t/\\est-c,ate:gory*?', 't/\\est-a,ct:ion*?');
        this.clock.tick(10500);

        this.send.should.have.been.calledWith([{
          category: 't_est-c_ate_gory_',
          action: 't/_est-a_ct_ion_'
        }]);
      });

      it('should track event with additional information', function () {
        this.analytics.trackEvent('test-category', 'test-action', {type: 'test-type'});
        this.clock.tick(10500);

        this.send.should.have.been.calledWith([{
          category: 'test-category',
          action: 'test-action'
        }, {
          category: 'test-category',
          action: 'test-action__type$test-type'
        }]);
      });

      it('should send two events to statistics server on tracking shortcut event', function () {
        this.analytics.trackShortcutEvent('test-category', 'test-action');
        this.clock.tick(10500);

        this.send.should.have.been.calledWith([{
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
          function () {
            const entity = {
              param1: 'first',
              param2: 'second',
              param3: 'third',
              param4: 'fourth',
              param5: 'should-be-ignored'
            };
            const trackedProperties = ['param1', 'param2', 'param3', 'param4'];
            this.analytics.trackEntityProperties('sample-entity', entity, trackedProperties);
            this.clock.tick(10500);

            const trackedData = [];
            trackedProperties.forEach(it => {
              trackedData.push({
                category: 'sample-entity',
                action: `${it}__${entity[it]}`
              });
            });
            this.send.should.have.been.calledWith(trackedData);
          }
        );

        it('should not send any data if no properties requested', function () {
          const entity = {
            param1: 'first',
            param2: 'second'
          };
          this.analytics.trackEntityProperties('sample-entity', entity, []);
          this.clock.tick(10500);

          this.send.should.not.have.been.called;
        });

        it('should not throw error if there are no some properties', function () {
          const entity = {
            param1: 'first',
            param2: 'second'
          };
          this.analytics.
            trackEntityProperties('entity', entity, ['param1', 'nonexistent-property']);
          this.clock.tick(10500);

          this.send.should.have.been.calledWith([{
            category: 'entity',
            action: 'param1__first'
          }, {
            category: 'entity',
            action: 'nonexistent-property__no-value'
          }]);
        });

        it('should work with subproperties', function () {
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
          this.analytics.trackEntityProperties('entity', entity, trackedProperties);
          this.clock.tick(10500);

          this.send.should.have.been.calledWith([{
            category: 'entity',
            action: 'property-subproperty2-subsubproperty__subsubproperty-value'
          }, {
            category: 'entity',
            action: 'property-subproperty3-nonexistent__no-value'
          }]);
        });
      });

      it('should send request to statistics server on page view', function () {
        this.analytics.trackPageView('test-page');
        this.clock.tick(10500);

        this.send.should.have.been.called;
      });

      it('should send request to statistics server multiple times', function () {
        //first loop
        this.analytics.trackPageView('test-page');
        this.clock.tick(10500);
        this.send.should.have.been.called;

        //second loop
        this.analytics.trackEvent('test-category', 'test-event');
        this.analytics.trackEvent('test-category-2', 'test-event-2');
        this.clock.tick(10500);
        this.send.should.calledWith([{
          category: 'test-category',
          action: 'test-event'
        }, {
          category: 'test-category-2',
          action: 'test-event-2'
        }
        ]);
      });

      describe('flushing restriction', () => {
        it('flushing should be allowed on second step', function () {
          let counter = 0;
          function flushingIsAllowedOnSecondCheck() {
            ++counter;
            return counter === 2;
          }

          customPlugin = new AnalyticsCustomPlugin(
            this.send,
            false,
            10000,
            flushingIsAllowedOnSecondCheck
          );
          this.analytics.config([customPlugin]);

          this.analytics.trackEvent('test-category', 'test-action');
          this.clock.tick(10500);

          this.send.should.not.have.been.called;
          this.clock.tick(10500);

          this.send.should.have.been.calledWith([{
            category: 'test-category',
            action: 'test-action'
          }]);
        });
      });
    });
    describe('#disabled', () => {
      beforeEach(function () {
        this.analytics.config([]);
      });

      it('should not send request to statistics server', function () {
        this.analytics.trackEvent('test-category', 'test-action');
        this.clock.tick(10500);

        this.send.should.not.have.been.called;
      });
    });
  });
});
