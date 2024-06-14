import {mount} from 'enzyme';

import Dialog, {DialogAttrs} from './dialog';
import styles from './dialog.css';

describe('Dialog', () => {
  const children = <div/>;
  const mountDialog = (props: DialogAttrs) =>
    mount<Dialog>(<Dialog label="Dialog" {...props} trapFocus={false}/>);

  it('should create component', () => {
    mountDialog({show: true, children}).should.have.type(Dialog);
  });

  it('should wrap children with dialog wrapper', () => {
    const {dialog} = mountDialog({show: true, children}).instance();
    should.exist(dialog);
    dialog?.should.match(`.${styles.container}`);
  });

  it('should use passed className', () => {
    const {dialog} = mountDialog({show: true, children, className: 'test-class'}).instance();
    should.exist(dialog);
    dialog?.should.match('.test-class');
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
    should.exist(instance.dialog);
    instance.handleClick({target: instance.dialog} as never);

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

    instance.getShortcutsMap().esc({} as KeyboardEvent);

    closeSpy.should.have.been.called;
    escSpy.should.have.been.called;
  });

  it('should not call onEscPress if is hidden', () => {
    const escSpy = sandbox.spy();
    const instance = mountDialog({show: false, children, onEscPress: escSpy}).instance();
    instance.getShortcutsMap().esc({} as KeyboardEvent);

    escSpy.should.not.have.been.called;
  });
});
