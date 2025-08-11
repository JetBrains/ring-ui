import {render} from '@testing-library/react';

import {act, ReactElement} from 'react';

import Alert from '../alert/alert';

import alert, {DEFAULT_ALERT_TIMEOUT} from './alert-service';

const SMALL_TICK = 1000;
const BIG_TICK = 2000;
const ALERT_SHOW_TIME = 100;

describe('Alert Service', () => {
  let alertKey: string | number;

  beforeEach(() => {
    vi.useFakeTimers({toFake: ['setTimeout']});
    let rerender: (element: ReactElement) => void;
    vi.spyOn(alert.reactRoot, 'render').mockImplementation(node => {
      const element = node as ReactElement;
      if (rerender == null) {
        rerender = render(element).rerender;
      } else {
        rerender(element);
      }
    });
  });

  afterEach(() => {
    alert.setDefaultTimeout(DEFAULT_ALERT_TIMEOUT);
    alert.removeWithoutAnimation(alertKey);
  });

  it('Should show alert', () => {
    alertKey = alert.message('foo');
    const alertItem = alert._getShowingAlerts()[0];

    expect('foo').to.equal(alertItem.message);
    expect(Alert.Type.MESSAGE).to.equal(alertItem.type);
    expect(DEFAULT_ALERT_TIMEOUT).to.equal(alertItem.timeout);
    expect(false).to.equal(alertItem.isClosing);
  });

  it('Should show message', () => {
    alertKey = alert.message('foo');
    expect(Alert.Type.MESSAGE).to.equal(alert._getShowingAlerts()[0].type);
  });

  it('Should show error', () => {
    alertKey = alert.error('foo');
    expect(Alert.Type.ERROR).to.equal(alert._getShowingAlerts()[0].type);
  });

  it('Should show warning', () => {
    alertKey = alert.warning('foo');
    expect(Alert.Type.WARNING).to.equal(alert._getShowingAlerts()[0].type);
  });

  it('Should join same alerts and shake', () => {
    alertKey = alert.message('foo');
    alertKey = alert.message('foo');

    expect(alert._getShowingAlerts().length).to.equal(1);
    expect(true).to.equal(alert._getShowingAlerts()[0].isShaking);
  });

  it('Should remove alert after timeout', () => {
    alertKey = alert.message('foo', ALERT_SHOW_TIME);
    act(() => vi.advanceTimersByTime(SMALL_TICK)); // alert timeout
    act(() => vi.advanceTimersByTime(SMALL_TICK)); // alert animation
    expect(alert._getShowingAlerts().length).to.equal(0);
  });

  it('should remove alert without animation', () => {
    alertKey = alert.message('foo');
    alert.removeWithoutAnimation(alertKey);
    expect(alert._getShowingAlerts().length).to.equal(0);
  });

  it('should remove alert after animation', () => {
    alertKey = alert.message('foo');
    alert.remove(alertKey);
    expect(true).to.equal(alert._getShowingAlerts().filter(it => it.key === alertKey)[0].isClosing);
    vi.advanceTimersByTime(SMALL_TICK);

    expect(alert._getShowingAlerts().length).to.equal(0);
  });

  it('should allow configuring default timeout', () => {
    alert.setDefaultTimeout(SMALL_TICK);
    alertKey = alert.message('foo');
    act(() => vi.advanceTimersByTime(BIG_TICK)); // alert timeout
    act(() => vi.advanceTimersByTime(SMALL_TICK)); // alert animation
    expect(alert._getShowingAlerts().length).to.equal(0);
  });
});
