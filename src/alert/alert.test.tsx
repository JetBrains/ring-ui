import {act} from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Alert from './alert';
import styles from './alert.css';

const TIMEOUT = 100;
const TICK = 500;

describe('Alert', () => {
  it('should render text', () => {
    render(<Alert type={Alert.Type.MESSAGE}>{'Test message'}</Alert>);
    expect(screen.getByText('Test message')).to.exist;
  });

  it('should transfer className', () => {
    render(<Alert className='foo' />);
    expect(screen.getByTestId('alert')).to.have.class('foo');
  });

  it('should render component', () => {
    render(
      <Alert type={Alert.Type.MESSAGE}>
        <div>{'foo'}</div>
      </Alert>,
    );
    expect(screen.getByText('foo')).to.exist;
  });

  it('should render an error', () => {
    render(<Alert type={Alert.Type.ERROR}>{'Test'}</Alert>);
    expect(screen.getByTestId('alert')).to.have.class(styles.error);
  });

  it('should be closeable if by default', () => {
    render(<Alert>{'Test element'}</Alert>);

    expect(screen.getByRole('button', {name: 'close alert'})).to.exist;
  });

  it('should be not closeable if defined', () => {
    render(<Alert closeable={false}>{'Test element'}</Alert>);

    expect(screen.queryByRole('button', {name: 'close alert'})).to.not.exist;
  });

  it('should call onCloseRequest on click by close button', async () => {
    const closeSpy = vi.fn();
    render(<Alert onCloseRequest={closeSpy}>{'Test element'}</Alert>);
    const closeElement = screen.queryByRole('button', {name: 'close alert'});
    if (closeElement) {
      await userEvent.click(closeElement);
    }
    expect(closeSpy).toHaveBeenCalled();
  });

  it('should call onCloseRequest on timeout', () => {
    vi.useFakeTimers({toFake: ['setTimeout']});
    const closeSpy = vi.fn();
    render(
      <Alert timeout={TIMEOUT} onCloseRequest={closeSpy}>
        {'Test element'}
      </Alert>,
    );

    act(() => {
      vi.advanceTimersByTime(TICK);
    });

    expect(closeSpy).toHaveBeenCalled();
  });
});
