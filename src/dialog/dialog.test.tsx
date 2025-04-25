import {fireEvent, render, screen} from '@testing-library/react';

import userEvent from '@testing-library/user-event';

import Dialog from './dialog';

describe('Dialog', () => {
  it('should create component', () => {
    render(<Dialog show />);
    expect(screen.getByRole('dialog')).to.exist;
  });

  it('should wrap children with dialog wrapper', () => {
    render(<Dialog show />);
    expect(screen.getByTestId('ring-dialog-container')).to.exist;
  });

  it('should use passed className', () => {
    render(<Dialog show className="test-class" />);
    expect(screen.getByTestId('ring-dialog-container')).to.have.class('test-class');
  });

  it('should call onOverlayClick and onCloseAttempt callbacks on click by overlay', async () => {
    const closeSpy = sandbox.spy();
    const clickSpy = sandbox.spy();
    render(<Dialog show onOverlayClick={clickSpy} onCloseAttempt={closeSpy} />);
    await userEvent.click(screen.getByTestId('ring-dialog-overlay'));

    expect(closeSpy).to.have.been.called;
    expect(clickSpy).to.have.been.called;
  });

  it('should call onEscPress and onCloseAttempt callbacks on Escape press', () => {
    const closeSpy = sandbox.spy();
    const escSpy = sandbox.spy();
    render(<Dialog show onEscPress={escSpy} onCloseAttempt={closeSpy} />);
    fireEvent.keyDown(document.documentElement, {which: 27}); // Escape

    expect(closeSpy).to.have.been.called;
    expect(escSpy).to.have.been.called;
  });

  it('should not call onEscPress if is hidden', () => {
    const escSpy = sandbox.spy();
    render(<Dialog onEscPress={escSpy} />);
    fireEvent.keyDown(document.documentElement, {which: 27}); // Escape

    expect(escSpy).to.not.have.been.called;
  });
});
