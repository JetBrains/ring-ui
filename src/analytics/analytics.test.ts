import analytics, {Analytics} from './analytics';
import AnalyticsCustomPlugin, {AnalyticsCustomPluginData} from './analytics__custom-plugin';

const TICK_INTERVAL = 10500;
const MAX_PACK_SIZE = 100;

describe('Analytics', () => {
  it('should be created', () => {
    expect(analytics).to.exist;
  });

  it('should export correct interface', () => {
    expect(analytics.trackEvent).to.exist;
  });

  describe('tracking events', () => {
    let send: (data: AnalyticsCustomPluginData[]) => void;
    let analyticsInstance: Analytics;
    beforeEach(() => {
      send = sandbox.spy();
      vi.useFakeTimers({toFake: ['setInterval']});
      analyticsInstance = new Analytics();
    });

    describe('#enabled', () => {
      let customPlugin: AnalyticsCustomPlugin;
      beforeEach(() => {
        customPlugin = new AnalyticsCustomPlugin(send);
        analyticsInstance.config([customPlugin]);
      });

      it('should send request to statistics server on tracking event', () => {
        analyticsInstance.trackEvent('test-category', 'test-action');
        vi.advanceTimersByTime(TICK_INTERVAL);

        expect(send).to.have.been.calledWith([
          {
            category: 'test-category',
            action: 'test-action',
            timestamp: sinon.match.number,
          },
        ]);
      });

      it('should support configuration via method config', () => {
        const flushingFunction = sandbox.spy();
        customPlugin.config({
          send: flushingFunction,
        });

        analyticsInstance.trackEvent('test-category', 'test-action');
        vi.advanceTimersByTime(TICK_INTERVAL);

        expect(send).to.not.have.been.called;
        expect(flushingFunction).to.have.been.calledWith([
          {
            category: 'test-category',
            action: 'test-action',
            timestamp: sinon.match.number,
          },
        ]);
      });

      it('should send request on achieving max pack size', () => {
        for (let i = 0; i < MAX_PACK_SIZE - 1; ++i) {
          analyticsInstance.trackEvent(`test-category-${i}`, 'test-action');
        }
        expect(customPlugin._data.length).to.equal(MAX_PACK_SIZE - 1);

        analyticsInstance.trackEvent('test-category-100', 'test-action');

        expect(send).to.have.been.called;
        expect(customPlugin._data.length).to.equal(0);
      });

      it('should configure max pack size via config', () => {
        customPlugin.config({
          send,
          flushMaxPackSize: MAX_PACK_SIZE + 2,
        });

        for (let i = 0; i < MAX_PACK_SIZE + 1; ++i) {
          analyticsInstance.trackEvent(`test-category-${i}`, 'test-action');
        }
        expect(customPlugin._data.length).to.equal(MAX_PACK_SIZE + 1);

        analyticsInstance.trackEvent('test-category-102', 'test-action');

        expect(send).to.have.been.called;
        expect(customPlugin._data.length).to.equal(0);
      });

      it('should track event with additional information', () => {
        analyticsInstance.trackEvent('test-category', 'test-action', {type: 'test-type'});
        vi.advanceTimersByTime(TICK_INTERVAL);

        expect(send).to.have.been.calledWith([
          {
            category: 'test-category',
            action: 'test-action',
            timestamp: sinon.match.number,
            data: {type: 'test-type'},
          },
        ]);
      });
    });
    describe('#disabled', () => {
      beforeEach(() => {
        analyticsInstance.config([]);
      });

      it('should not send request to statistics server', () => {
        analyticsInstance.trackEvent('test-category', 'test-action');
        vi.advanceTimersByTime(TICK_INTERVAL);

        expect(send).to.not.have.been.called;
      });
    });
  });
});
