import * as Sinon from 'sinon';

import Alert from '../alert/alert';

import alert from './alert-service';

const SMALL_TICK = 1000;
const BIG_TICK = 2000;
const ALERT_SHOW_TIME = 100;

describe('Alert Service', () => {
  let alertKey: string | number;
  let clock: Sinon.SinonFakeTimers;

  beforeEach(() => {
    clock = sandbox.useFakeTimers({toFake: ['setTimeout']});
  });

  afterEach(() => {
    alert.setDefaultTimeout(0);
    alert.removeWithoutAnimation(alertKey);
  });

  it('Should show alert', () => {
    alertKey = alert.message('foo');
    const alertItem = alert._getShowingAlerts()[0];

    'foo'.should.equal(alertItem.message);
    Alert.Type.MESSAGE.should.equal(alertItem.type);
    (0).should.equal(alertItem.timeout);
    false.should.equal(alertItem.isClosing);
  });

  it('Should show message', () => {
    alertKey = alert.message('foo');
    Alert.Type.MESSAGE.should.equal(alert._getShowingAlerts()[0].type);
  });

  it('Should show error', () => {
    alertKey = alert.error('foo');
    Alert.Type.ERROR.should.equal(alert._getShowingAlerts()[0].type);
  });

  it('Should show warning', () => {
    alertKey = alert.warning('foo');
    Alert.Type.WARNING.should.equal(alert._getShowingAlerts()[0].type);
  });

  it('Should join same alerts and shake', () => {
    alertKey = alert.message('foo');
    alertKey = alert.message('foo');

    alert._getShowingAlerts().length.should.equal(1);
    true.should.equal(alert._getShowingAlerts()[0].isShaking);
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
    true.should.equal(alert._getShowingAlerts().filter(it => it.key === alertKey)[0].isClosing);
    clock.tick(SMALL_TICK);

    alert._getShowingAlerts().length.should.equal(0);
  });

  it('should allow configuring default timeout', () => {
    alert.setDefaultTimeout(SMALL_TICK);
    alertKey = alert.message('foo');
    clock.tick(BIG_TICK);
    alert._getShowingAlerts().length.should.equal(0);
  });
});
