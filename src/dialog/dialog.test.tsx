import {fireEvent, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderToStaticMarkup} from 'react-dom/server';

import Dialog from './dialog';
import {resizeGeometry} from './dialog-geometry';
import Island, {Content, Header} from '../island/island';
import Shortcuts from '../shortcuts/shortcuts';

const dialogRect = {
  left: 100,
  top: 100,
  right: 500,
  bottom: 300,
  width: 400,
  height: 200,
  x: 100,
  y: 100,
  toJSON: () => ({}),
};

const prepareInteraction = () => {
  const inner = screen.getByTestId('ring-dialog-inner-container');
  vi.spyOn(inner, 'getBoundingClientRect').mockReturnValue(dialogRect);
  return inner;
};

const firePointerEvent = (
  element: Element,
  type: 'pointerdown' | 'pointermove' | 'lostpointercapture',
  {
    clientX,
    clientY,
    pointerId = 1,
    button = 0,
  }: {clientX: number; clientY: number; pointerId?: number; button?: number},
) => {
  const event = new Event(type, {bubbles: true});
  Object.assign(event, {button, clientX, clientY, pointerId});
  fireEvent(element, event);
};

describe('Dialog', () => {
  it('should create component', () => {
    render(<Dialog show />);
    expect(screen.getByRole('dialog')).to.exist;
  });

  it('should wrap children with dialog wrapper', () => {
    render(<Dialog show />);
    expect(screen.getByTestId('ring-dialog-container').tagName).to.equal('DIALOG');
  });

  it('should support the portal dialog', () => {
    render(<Dialog show native={false} />);
    expect(screen.getByTestId('ring-dialog-container').tagName).not.to.equal('DIALOG');
  });

  it('should render a native dialog in place', () => {
    render(
      <div data-test='dialog-owner'>
        <Dialog show />
      </div>,
    );

    expect(screen.getByRole('dialog').parentElement).to.equal(screen.getByTestId('dialog-owner'));
  });

  it('should render a native dialog on the server', () => {
    expect(renderToStaticMarkup(<Dialog show />)).to.contain('<dialog');
  });

  it('should use passed className', () => {
    render(<Dialog show className='test-class' />);
    expect(screen.getByTestId('ring-dialog-container')).to.have.class('test-class');
  });

  it('should pass HTML attributes to the native dialog', () => {
    render(<Dialog show aria-describedby='dialog-description' />);
    expect(screen.getByRole('dialog')).to.have.attribute('aria-describedby', 'dialog-description');
  });

  it('should be movable and resizable by default', () => {
    render(<Dialog show />);

    expect(screen.getByTestId('ring-dialog-move-handle')).to.exist;
    expect(screen.getAllByTestId(/^ring-dialog-resize-handle-/)).to.have.length(8);
    expect(screen.getByTestId('ring-dialog-resize-marker').parentElement).to.equal(
      screen.getByTestId('ring-dialog-resize-handle-se'),
    );
  });

  it('should allow movement and resizing to be disabled', () => {
    render(<Dialog show movable={false} resizable={false} />);

    expect(screen.queryByTestId('ring-dialog-move-handle')).not.to.exist;
    expect(screen.queryAllByTestId(/^ring-dialog-resize-handle-/)).to.be.empty;
    expect(screen.queryByTestId('ring-dialog-resize-marker')).not.to.exist;
  });

  it('should move the dialog within the viewport', () => {
    render(<Dialog show />);
    const inner = prepareInteraction();
    const handle = screen.getByTestId('ring-dialog-move-handle');

    firePointerEvent(handle, 'pointerdown', {clientX: 100, clientY: 100});
    firePointerEvent(handle, 'pointermove', {clientX: 150, clientY: 130});

    expect(inner.style.left).to.equal('150px');
    expect(inner.style.top).to.equal('130px');
    expect(inner.style.width).to.equal('');
  });

  it('should move the dialog from the whole header', () => {
    render(
      <Dialog show>
        <Header>{'A dialog title that may wrap'}</Header>
      </Dialog>,
    );
    const inner = prepareInteraction();
    const header = screen.getByTestId('ring-island-header');

    firePointerEvent(header, 'pointerdown', {clientX: 100, clientY: 100});
    firePointerEvent(header, 'pointermove', {clientX: 150, clientY: 130});

    expect(inner.style.left).to.equal('150px');
    expect(inner.style.top).to.equal('130px');
  });

  it('should not move the dialog from a nested island header', () => {
    render(
      <Dialog show>
        <Content>
          <Island>
            <Header>{'Nested title'}</Header>
          </Island>
        </Content>
      </Dialog>,
    );
    const inner = prepareInteraction();
    const header = screen.getByTestId('ring-island-header');

    firePointerEvent(header, 'pointerdown', {clientX: 100, clientY: 100});
    firePointerEvent(header, 'pointermove', {clientX: 150, clientY: 130});

    expect(inner.style.left).to.equal('');
    expect(inner.style.top).to.equal('');
  });

  it.each([
    ['n', {left: 100, top: 110, width: 400, height: 190}],
    ['ne', {left: 100, top: 110, width: 420, height: 190}],
    ['e', {left: 100, top: 100, width: 420, height: 200}],
    ['se', {left: 100, top: 100, width: 420, height: 210}],
    ['s', {left: 100, top: 100, width: 400, height: 210}],
    ['sw', {left: 120, top: 100, width: 380, height: 210}],
    ['w', {left: 120, top: 100, width: 380, height: 200}],
    ['nw', {left: 120, top: 110, width: 380, height: 190}],
  ])('should resize from the %s handle while preserving the opposite edges', (direction, expected) => {
    render(<Dialog show />);
    const inner = prepareInteraction();
    const handle = screen.getByTestId(`ring-dialog-resize-handle-${direction}`);

    firePointerEvent(handle, 'pointerdown', {clientX: 100, clientY: 100});
    firePointerEvent(handle, 'pointermove', {clientX: 120, clientY: 110});

    expect(inner.style.left).to.equal(`${expected.left}px`);
    expect(inner.style.top).to.equal(`${expected.top}px`);
    expect(inner.style.width).to.equal(`${expected.width}px`);
    expect(inner.style.height).to.equal(`${expected.height}px`);
  });

  it('should limit resizing to the viewport', () => {
    render(<Dialog show />);
    const inner = prepareInteraction();
    const handle = screen.getByTestId('ring-dialog-resize-handle-se');

    firePointerEvent(handle, 'pointerdown', {clientX: 100, clientY: 100});
    firePointerEvent(handle, 'pointermove', {clientX: 2000, clientY: 2000});

    expect(inner.style.width).to.equal(`${window.innerWidth - dialogRect.left}px`);
    expect(inner.style.height).to.equal(`${window.innerHeight - dialogRect.top}px`);
  });

  it('should stop resizing when pointer capture is lost', () => {
    render(<Dialog show />);
    const inner = prepareInteraction();
    const handle = screen.getByTestId('ring-dialog-resize-handle-se');

    firePointerEvent(handle, 'pointerdown', {clientX: 100, clientY: 100});
    firePointerEvent(handle, 'lostpointercapture', {clientX: 100, clientY: 100});
    firePointerEvent(handle, 'pointermove', {clientX: 120, clientY: 110});

    expect(inner.style.width).to.equal('400px');
    expect(inner.style.height).to.equal('200px');
  });

  it('should enforce the minimum size when resizing from the top-left', () => {
    render(<Dialog show />);
    const inner = prepareInteraction();
    const handle = screen.getByTestId('ring-dialog-resize-handle-nw');

    firePointerEvent(handle, 'pointerdown', {clientX: 100, clientY: 100});
    firePointerEvent(handle, 'pointermove', {clientX: 2000, clientY: 2000});

    expect(inner.style.width).to.equal('256px');
    expect(inner.style.height).to.equal('160px');
    expect(inner.style.left).to.equal('244px');
    expect(inner.style.top).to.equal('140px');
  });

  it('should support overriding the minimum resize size with CSS', () => {
    render(<Dialog show />);
    const inner = prepareInteraction();
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      minWidth: '320px',
      minHeight: '180px',
    } as CSSStyleDeclaration);
    const handle = screen.getByTestId('ring-dialog-resize-handle-nw');

    firePointerEvent(handle, 'pointerdown', {clientX: 100, clientY: 100});
    firePointerEvent(handle, 'pointermove', {clientX: 2000, clientY: 2000});

    expect(inner.style.width).to.equal('320px');
    expect(inner.style.height).to.equal('180px');
    expect(inner.style.left).to.equal('180px');
    expect(inner.style.top).to.equal('120px');
  });

  it('should constrain the minimum resize size to the available viewport', () => {
    const interaction = {
      pointerId: 1,
      startX: 0,
      startY: 0,
      minWidth: 320,
      minHeight: 180,
      geometry: {left: 10, top: 10, width: 200, height: 140},
    };

    expect(resizeGeometry({...interaction, direction: 'nw'}, 1000, 1000, 210, 150)).to.deep.equal({
      left: 0,
      top: 0,
      width: 210,
      height: 150,
    });
    expect(resizeGeometry({...interaction, direction: 'se'}, -1000, -1000, 210, 150)).to.deep.equal({
      left: 10,
      top: 10,
      width: 200,
      height: 140,
    });
  });

  it.each([true, false])('should preserve its geometry when reopened with native=%s', native => {
    const {rerender} = render(<Dialog show native={native} />);
    prepareInteraction();
    const handle = screen.getByTestId('ring-dialog-resize-handle-nw');
    firePointerEvent(handle, 'pointerdown', {clientX: 100, clientY: 100});
    firePointerEvent(handle, 'pointermove', {clientX: 120, clientY: 110});

    rerender(<Dialog show={false} native={native} />);
    rerender(<Dialog show native={native} />);

    const reopened = screen.getByTestId('ring-dialog-inner-container');
    expect(reopened.style.position).to.equal('fixed');
    expect(reopened.style.left).to.equal('120px');
    expect(reopened.style.top).to.equal('110px');
    expect(reopened.style.width).to.equal('380px');
    expect(reopened.style.height).to.equal('190px');
  });

  it('should fit preserved geometry into a smaller viewport', () => {
    const viewport = {width: window.innerWidth, height: window.innerHeight};
    const {rerender} = render(<Dialog show />);
    prepareInteraction();
    const handle = screen.getByTestId('ring-dialog-resize-handle-nw');
    firePointerEvent(handle, 'pointerdown', {clientX: 100, clientY: 100});
    firePointerEvent(handle, 'pointermove', {clientX: 120, clientY: 110});

    rerender(<Dialog show={false} />);
    window.innerWidth = 300;
    window.innerHeight = 180;
    rerender(<Dialog show />);

    const reopened = screen.getByTestId('ring-dialog-inner-container');
    expect(reopened.style.left).to.equal('0px');
    expect(reopened.style.top).to.equal('0px');
    expect(reopened.style.width).to.equal('300px');
    expect(reopened.style.height).to.equal('180px');

    window.innerWidth = viewport.width;
    window.innerHeight = viewport.height;
  });

  it('should keep native closing controlled and preserve autoFocusFirst=false', () => {
    render(
      <Dialog show autoFocusFirst={false}>
        <button type='button'>{'Action'}</button>
      </Dialog>,
    );
    const dialog = screen.getByRole('dialog');
    const cancelEvent = new Event('cancel', {bubbles: true, cancelable: true});
    fireEvent(dialog, cancelEvent);

    expect(cancelEvent.defaultPrevented).to.equal(true);
    expect(dialog).to.have.attribute('open');
    expect(document.activeElement).to.equal(dialog);
  });

  it('should call onOverlayClick and onCloseAttempt callbacks on click by overlay', async () => {
    const closeSpy = vi.fn();
    const clickSpy = vi.fn();
    render(<Dialog show native={false} onOverlayClick={clickSpy} onCloseAttempt={closeSpy} />);
    await userEvent.click(screen.getByTestId('ring-dialog-overlay'));

    expect(closeSpy).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
  });

  it('should call onEscPress and onCloseAttempt callbacks on Escape press', () => {
    const closeSpy = vi.fn();
    const escSpy = vi.fn();
    render(<Dialog show onEscPress={escSpy} onCloseAttempt={closeSpy} />);
    fireEvent.keyDown(document.documentElement, {which: 27}); // Escape

    expect(closeSpy).toHaveBeenCalled();
    expect(escSpy).toHaveBeenCalled();
  });

  it('should not call onEscPress if is hidden', () => {
    const escSpy = vi.fn();
    render(<Dialog onEscPress={escSpy} />);
    fireEvent.keyDown(document.documentElement, {which: 27}); // Escape

    expect(escSpy).not.toHaveBeenCalled();
  });

  it('should not swallow Escape while hidden', () => {
    const escSpy = vi.fn(() => true);
    render(
      <>
        <Shortcuts map={{esc: escSpy}} scope='test' />
        <Dialog show={false} />
      </>,
    );
    fireEvent.keyDown(document.documentElement, {which: 27});

    expect(escSpy).toHaveBeenCalled();
  });
});
