import {fireEvent, render, screen} from '@testing-library/react';

import userEvent from '@testing-library/user-event';

import Dialog from './dialog';

describe('Dialog', () => {
  it('should create component', () => {
    render(<Dialog show/>);
    screen.getByRole('dialog').should.exist;
  });

  it('should wrap children with dialog wrapper', () => {
    render(<Dialog show/>);
    screen.getByTestId('ring-dialog-container').should.exist;
  });

  it('should use passed className', () => {
    render(<Dialog show className="test-class"/>);
    screen.getByTestId('ring-dialog-container').should.have.class('test-class');
  });

  it('should call onOverlayClick and onCloseAttempt callbacks on click by overlay', async () => {
    const closeSpy = sandbox.spy();
    const clickSpy = sandbox.spy();
    render(<Dialog show onOverlayClick={clickSpy} onCloseAttempt={closeSpy}/>);
    await userEvent.click(screen.getByTestId('ring-dialog-overlay'));

    closeSpy.should.have.been.called;
    clickSpy.should.have.been.called;
  });

  it('should call onEscPress and onCloseAttempt callbacks on Escape press', () => {
    const closeSpy = sandbox.spy();
    const escSpy = sandbox.spy();
    render(<Dialog show onEscPress={escSpy} onCloseAttempt={closeSpy}/>);
    fireEvent.keyDown(document.documentElement, {which: 27}); // Escape

    closeSpy.should.have.been.called;
    escSpy.should.have.been.called;
  });

  it('should not call onEscPress if is hidden', () => {
    const escSpy = sandbox.spy();
    render(<Dialog onEscPress={escSpy}/>);
    fireEvent.keyDown(document.documentElement, {which: 27}); // Escape

    escSpy.should.not.have.been.called;
  });
});
