import React from 'react';
import {shallow, mount, render} from 'enzyme';

import Alert from './alert';
import styles from './alert.css';

const TICK = 500;

describe('Alert', () => {
  const mountAlert = props => mount(<Alert {...props}/>);
  const shallowAlert = props => shallow(<Alert {...props}/>);
  const renderAlert = props => render(<Alert {...props}/>);

  let clock;
  beforeEach(() => {
    clock = sandbox.useFakeTimers();
  });

  it('should render', () => {
    mountAlert({}).should.have.type(Alert);
  });

  it('should render text', () => {
    const alertComponent = renderAlert({
      children: 'Test message',
      type: Alert.Type.MESSAGE
    });
    alertComponent.should.have.text('Test message');
  });

  it('should transfer className', () => {
    shallowAlert({className: 'foo'}).should.have.className('foo');
  });

  it('should render component', () => {
    const alertComponent = renderAlert({
      children: <div>{'foo'}</div>,
      type: Alert.Type.MESSAGE
    });
    alertComponent.should.have.text('foo');
  });

  it('should render an error', () => {
    const alertComponent = shallowAlert({
      children: 'Test',
      type: Alert.Type.ERROR
    });
    alertComponent.should.have.className(styles.error);
  });

  it('should be closeable if by default', () => {
    const alertComponent = shallowAlert({children: 'Test element'});

    alertComponent.should.have.descendants('button[data-test="alert-close"]');
  });

  it('should be not closeable if defined', () => {
    const alertComponent = shallowAlert({
      children: 'Test element',
      closeable: false
    });

    alertComponent.should.not.have.descendants('button[data-test="alert-close"]');
  });

  it('should call onCloseRequest on click by close button', () => {
    const closeSpy = sandbox.spy();
    const alertComponent = shallowAlert({
      children: 'Test element',
      onCloseRequest: closeSpy
    });
    const closeElement = alertComponent.find('button[data-test="alert-close"]');
    closeElement.simulate('click');
    closeSpy.should.have.been.called;
  });

  it('should call onCloseRequest on timeout', () => {
    const closeSpy = sandbox.spy();
    mountAlert({
      children: 'Test element',
      timeout: 100,
      onCloseRequest: closeSpy
    });
    clock.tick(TICK);

    closeSpy.should.have.been.called;
  });
});
