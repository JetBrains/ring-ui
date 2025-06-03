import {render, screen, fireEvent, getByTestId} from '@testing-library/react';

import {expect} from 'vitest';

import {getRect, getStyles} from '../global/dom';
import simulateCombo from '../../test-helpers/simulate-combo';

import Popup, {PopupAttrs} from './popup';
import {MinWidth} from './popup.consts';

describe('Popup', () => {
  const renderPopup = (props?: Partial<PopupAttrs>) => render(<Popup {...{children: '', ...props}} />);

  it('should create component', () => {
    renderPopup();
    expect(screen.getByTestId('ring-popup')).to.exist;
  });

  it('should allow pass DOM node as a target', () => {
    const targetNode = document.createElement('div');
    renderPopup({target: targetNode});
    expect(getByTestId(targetNode, 'ring-popup')).to.exist;
  });

  it('should attempt to close by pressing esc', () => {
    const onCloseAttempt = vi.fn();
    renderPopup({onCloseAttempt});

    simulateCombo('esc');

    expect(onCloseAttempt).toHaveBeenCalled();
  });

  describe('close by pointer down', () => {
    const downEvent = new PointerEvent('pointerdown', {
      bubbles: true,
      cancelable: false,
    });

    beforeEach(() => {
      vi.useFakeTimers({toFake: ['setTimeout']});
    });

    it('should attempt to close by pointer down outside the element', () => {
      const onCloseAttempt = vi.fn();
      renderPopup({onCloseAttempt});

      vi.advanceTimersByTime(0);
      fireEvent(document.body, downEvent);
      expect(onCloseAttempt).toHaveBeenCalled();
    });

    it('should pass event to onCloseAttempt callback when closing by document pointer down event', () => {
      const onCloseAttempt = vi.fn();
      renderPopup({onCloseAttempt});

      vi.advanceTimersByTime(0);
      fireEvent(document.body, downEvent);
      expect(onCloseAttempt).toHaveBeenCalledWith(expect.objectContaining({type: 'pointerdown'}), expect.anything());
    });

    it('should not close popup if popup hidden', () => {
      const onCloseAttempt = vi.fn();
      renderPopup({
        hidden: true,
        onCloseAttempt,
      });

      vi.advanceTimersByTime(0);
      fireEvent(document.body, downEvent);
      expect(onCloseAttempt).not.toHaveBeenCalled;
    });

    it('should be closed by pointer down event outside the element after show', () => {
      const onCloseAttempt = vi.fn();
      const popup = renderPopup({
        onCloseAttempt,
      });

      popup.rerender(<Popup {...{children: '', onCloseAttempt, hidden: false}} />);
      vi.advanceTimersByTime(0);
      fireEvent(document.body, downEvent);
      expect(onCloseAttempt).toHaveBeenCalled();
    });

    it("shouldn't be closed by pointer down event inside the element", () => {
      const onCloseAttempt = vi.fn();
      renderPopup({onCloseAttempt});

      vi.advanceTimersByTime(0);
      const popup = screen.getByTestId('ring-popup');
      fireEvent(popup, downEvent);
      expect(onCloseAttempt).not.toHaveBeenCalled;
    });
  });

  describe('positioning', () => {
    let element: HTMLElement;
    beforeEach(() => {
      vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
        cb(0);
        return 0;
      });
    });

    afterEach(() => {
      if (element && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });

    it.skip('top-left direction', () => {
      element = document.createElement('div');
      element.setAttribute('style', 'position: absolute; top: 10px; left: 15px; width: 50px; height: 50px;');
      document.body.append(element);

      renderPopup({
        directions: [Popup.PopupProps.Directions.TOP_LEFT],
        anchorElement: element,
      });

      const popupElement = screen.getByTestId('ring-popup');
      expect(popupElement).to.exist;
      const elementOffset = getRect(element);

      expect(parseInt(getStyles(popupElement).left, 10)).to.equal(
        elementOffset.left + elementOffset.width - popupElement.offsetWidth,
      );
      expect(parseInt(getStyles(popupElement).top, 10)).to.equal(elementOffset.top - popupElement.offsetHeight);
    });

    it('should limit top by sidePadding if opens to the top', () => {
      const SIDE_PADDING = 8;
      element = document.createElement('div');
      element.setAttribute('style', 'position: absolute; top: 10px; left: 15px; width: 50px; height: 50px;');
      document.body.append(element);

      renderPopup({
        directions: [Popup.PopupProps.Directions.TOP_LEFT],
        anchorElement: element,
        sidePadding: SIDE_PADDING,
        children: <div style={{height: '300px'}}>{'foo'}</div>,
      });

      const popupElement = screen.getByTestId('ring-popup');
      expect(popupElement).to.exist;
      expect(getStyles(popupElement).top).to.equal(`${SIDE_PADDING}px`);
    });

    it('bottom-right corner', () => {
      element = document.createElement('div');
      element.setAttribute('style', 'position: absolute; top: 10px; left: 15px; width: 50px; height: 50px;');
      document.body.append(element);

      renderPopup({
        directions: [Popup.PopupProps.Directions.BOTTOM_RIGHT],
        anchorElement: element,
      });

      const popupElement = screen.getByTestId('ring-popup');
      expect(popupElement).to.exist;
      const elementOffset = getRect(element);

      expect(parseInt(getStyles(popupElement).left, 10)).to.equal(elementOffset.left);
      expect(parseInt(getStyles(popupElement).top, 10)).to.equal(elementOffset.top + elementOffset.height);
    });

    it('should add specified offset', () => {
      const OFFSET = 10;
      element = document.createElement('div');
      element.setAttribute('style', 'position: absolute; top: 10px; left: 15px; width: 50px; height: 50px;');
      document.body.append(element);

      renderPopup({
        directions: [Popup.PopupProps.Directions.BOTTOM_RIGHT],
        anchorElement: element,
        left: OFFSET,
        top: OFFSET,
      });

      const popupElement = screen.getByTestId('ring-popup');
      expect(popupElement).to.exist;
      const elementOffset = getRect(element);

      expect(parseInt(getStyles(popupElement).left, 10)).to.equal(elementOffset.left + OFFSET);
      expect(parseInt(getStyles(popupElement).top, 10)).to.equal(elementOffset.top + elementOffset.height + OFFSET);
    });

    it.skip('Should support minWidth = MinWidth.TARGET', () => {
      element = document.createElement('div');
      element.setAttribute('style', 'width: 50px; padding-left: 20px;');
      document.body.append(element);

      renderPopup({
        minWidth: MinWidth.TARGET,
        anchorElement: element,
        hidden: false,
      });

      const popupElement = screen.getByTestId('ring-popup');
      expect(popupElement).to.exist;
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      expect(parseInt(getStyles(popupElement).minWidth, 10)).to.equal(70);
      element.remove();
    });

    it('Should support minWidth = number in pixels if anchor width is less than minWidth', () => {
      element = document.createElement('div');
      element.setAttribute('style', 'width: 50px;');
      document.body.append(element);

      const WIDTH = 345;
      renderPopup({
        minWidth: WIDTH,
        hidden: false,
        anchorElement: element,
      });

      const popupElement = screen.getByTestId('ring-popup');
      expect(popupElement).to.exist;
      expect(parseInt(popupElement.style.minWidth, 10)).to.equal(WIDTH);
    });

    it.skip('Should use width of anchor if it is bigger than minWidth', () => {
      const WIDTH = 345;

      element = document.createElement('div');
      element.setAttribute('style', `width: ${WIDTH}px;`);
      document.body.append(element);

      renderPopup({
        minWidth: 20,
        hidden: false,
        anchorElement: element,
      });

      const popupElement = screen.getByTestId('ring-popup');
      expect(popupElement).to.exist;
      expect(parseInt(popupElement.style.minWidth, 10)).to.equal(WIDTH);
    });
  });
});
