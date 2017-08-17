import React from 'react';
import {mount} from 'enzyme';

import Dialog from './dialog';
import styles from './dialog.css';

describe('Dialog', () => {
  const children = <div/>;
  const mountDialog = props => mount(<Dialog {...props} {...{trapFocus: false}}/>);

  it('should create component', () => {
    mountDialog({show: true, children}).should.have.type(Dialog);
  });

  it('should wrap children with dialog wrapper', () => {
    mountDialog({show: true, children}).instance().dialog.should.match(`.${styles.container}`);
  });

  it('should use passed className', () => {
    mountDialog({show: true, children, className: 'test-class'}).instance().dialog.should.
      match('.test-class');
  });

  it('should call onOverlayClick and onCloseAttempt callbacks on click by overlay', () => {
    const closeSpy = sandbox.spy();
    const clickSpy = sandbox.spy();
    const instance = mountDialog({
      show: true,
      children,
      onOverlayClick: clickSpy,
      onCloseAttempt: closeSpy
    }).instance();
    instance.handleClick({target: instance.dialog});

    closeSpy.should.have.been.called;
    clickSpy.should.have.been.called;
  });

  it('should call onEscPress and onCloseAttempt callbacks on click by overlay', () => {
    const closeSpy = sandbox.spy();
    const escSpy = sandbox.spy();
    const instance = mountDialog({
      show: true,
      children,
      onEscPress: escSpy,
      onCloseAttempt: closeSpy
    }).instance();

    instance.getShortcutsMap().esc({});

    closeSpy.should.have.been.called;
    escSpy.should.have.been.called;
  });

  it('should not call onEscPress if is hidden', () => {
    const escSpy = sandbox.spy();
    const instance = mountDialog({show: false, children, onEscPress: escSpy}).instance();
    instance.getShortcutsMap().esc({});

    escSpy.should.not.have.been.called;
  });
});
