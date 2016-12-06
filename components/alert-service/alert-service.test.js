import Alert from '../alert/alert';
import {
  showError,
  showMessage,
  showWarning,
  remove,
  removeWithoutAnimation,
  getShowingAlerts,
  setDefaultTimeout
} from './alert-service';

describe('Alert Service', () => {
  let alertKey;
  let clock;

  beforeEach(() => {
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    clock.restore();
    setDefaultTimeout(0);
    removeWithoutAnimation(alertKey);
  });

  it('Should show alert', () => {
    alertKey = showMessage('foo');
    const alert = getShowingAlerts()[0];

    alert.message.should.equal('foo');
    alert.type.should.equal(Alert.Type.MESSAGE);
    alert.timeout.should.equal(0);
    alert.isClosing.should.equal(false);
    alert.count.should.equal(1);
  });

  it('Should show message', () => {
    alertKey = showMessage('foo');
    getShowingAlerts()[0].type.should.equal(Alert.Type.MESSAGE);
  });

  it('Should show error', () => {
    alertKey = showError('foo');
    getShowingAlerts()[0].type.should.equal(Alert.Type.ERROR);
  });

  it('Should show warning', () => {
    alertKey = showWarning('foo');
    getShowingAlerts()[0].type.should.equal(Alert.Type.WARNING);
  });

  it('Should join same alerts', () => {
    alertKey = showMessage('foo');
    alertKey = showMessage('foo');

    getShowingAlerts().length.should.equal(1);
    getShowingAlerts()[0].count.should.equal(2);
  });

  it('Should remove alert after timeout', () => {
    alertKey = showMessage('foo', 100);
    clock.tick(1000);
    getShowingAlerts().length.should.equal(0);
  });

  it('Should remove alert after timeout', () => {
    alertKey = showMessage('foo', 100);
    clock.tick(1000);
    getShowingAlerts().length.should.equal(0);
  });

  it('should remove alert without animation', () => {
    alertKey = showMessage('foo');
    removeWithoutAnimation(alertKey);
    getShowingAlerts().length.should.equal(0);
  });

  it('should remove alert after animation', () => {
    alertKey = showMessage('foo');
    remove(alertKey);
    getShowingAlerts().filter(it => it.key === alertKey)[0].isClosing.should.be.true;
    clock.tick(1000);

    getShowingAlerts().length.should.equal(0);
  });

  it('should allow configuting default timeout', () => {
    setDefaultTimeout(1000);
    alertKey = showMessage('foo');
    clock.tick(2000);
    getShowingAlerts().length.should.equal(0);
  });
});
