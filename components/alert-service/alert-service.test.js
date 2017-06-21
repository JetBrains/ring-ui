import Alert from '../alert/alert';

import alert from './alert-service';

const SMALL_TICK = 1000;
const BIG_TICK = 2000;
const ALERT_SHOW_TIME = 100;

describe('Alert Service', () => {
  let alertKey;
  let clock;

  beforeEach(() => {
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    clock.restore();
    alert.setDefaultTimeout(0);
    alert.removeWithoutAnimation(alertKey);
  });

  it('Should show alert', () => {
    alertKey = alert.message('foo');
    const alertItem = alert._getShowingAlerts()[0];

    alertItem.message.should.equal('foo');
    alertItem.type.should.equal(Alert.Type.MESSAGE);
    alertItem.timeout.should.equal(0);
    alertItem.isClosing.should.equal(false);
    alertItem.count.should.equal(1);
  });

  it('Should show message', () => {
    alertKey = alert.message('foo');
    alert._getShowingAlerts()[0].type.should.equal(Alert.Type.MESSAGE);
  });

  it('Should show error', () => {
    alertKey = alert.error('foo');
    alert._getShowingAlerts()[0].type.should.equal(Alert.Type.ERROR);
  });

  it('Should show warning', () => {
    alertKey = alert.warning('foo');
    alert._getShowingAlerts()[0].type.should.equal(Alert.Type.WARNING);
  });

  it('Should join same alerts', () => {
    const SHOW_ALERTS_COUNT = 2;
    alertKey = alert.message('foo');
    alertKey = alert.message('foo');

    alert._getShowingAlerts().length.should.equal(1);
    alert._getShowingAlerts()[0].count.should.equal(SHOW_ALERTS_COUNT);
  });

  it('Should remove alert after timeout', () => {
    alertKey = alert.message('foo', ALERT_SHOW_TIME);
    clock.tick(SMALL_TICK);
    alert._getShowingAlerts().length.should.equal(0);
  });

  it('Should remove alert after timeout', () => {
    alertKey = alert.message('foo', ALERT_SHOW_TIME);
    clock.tick(SMALL_TICK);
    alert._getShowingAlerts().length.should.equal(0);
  });

  it('should remove alert without animation', () => {
    alertKey = alert.message('foo');
    alert.removeWithoutAnimation(alertKey);
    alert._getShowingAlerts().length.should.equal(0);
  });

  it('should remove alert after animation', () => {
    alertKey = alert.message('foo');
    alert.remove(alertKey);
    alert._getShowingAlerts().filter(it => it.key === alertKey)[0].isClosing.should.be.true;
    clock.tick(SMALL_TICK);

    alert._getShowingAlerts().length.should.equal(0);
  });

  it('should allow configuting default timeout', () => {
    alert.setDefaultTimeout(SMALL_TICK);
    alertKey = alert.message('foo');
    clock.tick(BIG_TICK);
    alert._getShowingAlerts().length.should.equal(0);
  });
});
