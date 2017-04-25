import 'dom4';
import React from 'react';
import {isCompositeComponentWithType, renderIntoDocument} from 'react-dom/test-utils';

import Dialog from './dialog';
import styles from './dialog.css';

describe('Dialog', () => {
  const children = <div />;
  const renderComponent = props => renderIntoDocument(<Dialog {...props} />);

  it('should create component', () => {
    isCompositeComponentWithType(renderComponent({show: true, children}), Dialog).should.be.true;
  });

  it('should wrap children with dialog wrapper', () => {
    renderComponent({show: true, children}).refs.dialog.should.match(`.${styles.container}`);
  });

  it('should use passed className', () => {
    renderComponent({show: true, children, className: 'test-class'}).refs.dialog.should.match('.test-class');
  });

  it('should call onOverlayClick and onCloseAttempt callbacks on click by overlay', () => {
    const closeSpy = sinon.spy();
    const clickSpy = sinon.spy();
    const instance = renderComponent({show: true, children, onOverlayClick: clickSpy, onCloseAttempt: closeSpy});
    instance.handleClick({target: instance.refs.dialog});

    closeSpy.should.have.been.called;
    clickSpy.should.have.been.called;
  });

  it('should call onEscPress and onCloseAttempt callbacks on click by overlay', () => {
    const closeSpy = sinon.spy();
    const escSpy = sinon.spy();
    const instance = renderComponent({show: true, children, onEscPress: escSpy, onCloseAttempt: closeSpy});

    instance.handleKeyDown({key: 'Escape'});

    closeSpy.should.have.been.called;
    escSpy.should.have.been.called;
  });

  it('should not call onEscPress if is hidden', () => {
    const escSpy = sinon.spy();
    const instance = renderComponent({show: false, children, onEscPress: escSpy});
    instance.handleKeyDown({key: 'Escape'});

    escSpy.should.not.have.been.called;
  });
});
