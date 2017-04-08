import React from 'react';
import TestUtils, {
  isCompositeComponentWithType,
  renderIntoDocument
} from 'react-dom/test-utils';
import Alert from './alert';
import styles from './alert.css';

describe('Alert', () => {
  const renderComponent = props => renderIntoDocument(<Alert {...props}/>);

  let clock;
  beforeEach(() => {
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    clock.restore();
  });

  it('should render', () => {
    isCompositeComponentWithType(renderComponent({}), Alert).should.be.true;
  });

  it('should render text', () => {
    const alertComponent = renderComponent({
      children: 'Test message',
      type: Alert.Type.MESSAGE
    });
    alertComponent.node.should.contain.text('Test message');
  });

  it('should transfer className', () => {
    renderComponent({className: 'foo'}).node.should.have.class('foo');
  });

  it('should render component', () => {
    const alertComponent = renderComponent({
      children: <div>{'foo'}</div>,
      type: Alert.Type.MESSAGE
    });
    alertComponent.node.should.contain.text('foo');
  });

  it('should render an error', () => {
    const alertComponent = renderComponent({
      children: 'Test',
      type: Alert.Type.ERROR
    });
    alertComponent.node.should.have.class(styles.error);
  });

  it('should be closeable if by default', () => {
    const alertComponent = renderComponent({children: 'Test element'});

    alertComponent.node.should.contain('*[data-test="alert-close"]');
  });

  it('should be not closeable if defined', () => {
    const alertComponent = renderComponent({
      children: 'Test element',
      closeable: false
    });

    alertComponent.node.should.not.contain('*[data-test="alert-close"]');
  });

  it('should call onCloseRequest on click by close button', () => {
    const closeSpy = sinon.spy();
    const alertComponent = renderComponent({
      children: 'Test element',
      onCloseRequest: closeSpy
    });
    const closeElement = alertComponent.node.querySelector('*[data-test="alert-close"]');

    TestUtils.Simulate.click(closeElement);
    closeSpy.should.have.been.called;
  });

  it('should call onCloseRequest on timeout', () => {
    const closeSpy = sinon.spy();
    renderComponent({
      children: 'Test element',
      timeout: 100,
      onCloseRequest: closeSpy
    });
    clock.tick(500);

    closeSpy.should.have.been.called;
  });
});
