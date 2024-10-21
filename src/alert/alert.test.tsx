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
    screen.getByText('Test message').should.exist;
  });

  it('should transfer className', () => {
    render(<Alert className="foo" />);
    screen.getByTestId('alert').should.have.class('foo');
  });

  it('should render component', () => {
    render(
      <Alert type={Alert.Type.MESSAGE}>
        <div>{'foo'}</div>
      </Alert>,
    );
    screen.getByText('foo').should.exist;
  });

  it('should render an error', () => {
    render(<Alert type={Alert.Type.ERROR}>{'Test'}</Alert>);
    screen.getByTestId('alert').should.have.class(styles.error);
  });

  it('should be closeable if by default', () => {
    render(<Alert>{'Test element'}</Alert>);

    screen.getByRole('button', {name: 'close alert'}).should.exist;
  });

  it('should be not closeable if defined', () => {
    render(<Alert closeable={false}>{'Test element'}</Alert>);

    should.not.exist(screen.queryByRole('button', {name: 'close alert'}));
  });

  it('should call onCloseRequest on click by close button', async () => {
    const closeSpy = sandbox.spy();
    render(<Alert onCloseRequest={closeSpy}>{'Test element'}</Alert>);
    const closeElement = screen.queryByRole('button', {name: 'close alert'});
    if (closeElement != null) {
      await userEvent.click(closeElement);
    }
    closeSpy.should.have.been.called;
  });

  it('should call onCloseRequest on timeout', () => {
    const clock = sandbox.useFakeTimers({toFake: ['setTimeout']});
    const closeSpy = sandbox.spy();
    render(
      <Alert timeout={TIMEOUT} onCloseRequest={closeSpy}>
        {'Test element'}
      </Alert>,
    );

    act(() => {
      clock.tick(TICK);
    });

    closeSpy.should.have.been.called;
  });
});
