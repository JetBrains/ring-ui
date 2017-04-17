import Alert from '../alert/alert';

import alert from './alert-service';

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
    alertKey = alert.message('foo');
    alertKey = alert.message('foo');

    alert._getShowingAlerts().length.should.equal(1);
    alert._getShowingAlerts()[0].count.should.equal(2);
  });

  it('Should remove alert after timeout', () => {
    alertKey = alert.message('foo', 100);
    clock.tick(1000);
    alert._getShowingAlerts().length.should.equal(0);
  });

  it('Should remove alert after timeout', () => {
    alertKey = alert.message('foo', 100);
    clock.tick(1000);
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
    clock.tick(1000);

    alert._getShowingAlerts().length.should.equal(0);
  });

  it('should allow configuting default timeout', () => {
    alert.setDefaultTimeout(1000);
    alertKey = alert.message('foo');
    clock.tick(2000);
    alert._getShowingAlerts().length.should.equal(0);
  });
});
