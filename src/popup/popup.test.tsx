import * as Sinon from 'sinon';
import {shallow, mount} from 'enzyme';

import {getRect, getStyles} from '../global/dom';
import simulateCombo from '../../test-helpers/simulate-combo';

import Popup, {PopupAttrs} from './popup';
import {MinWidth} from './popup.consts';

describe('Popup', () => {
  const shallowPopup = (props?: Partial<PopupAttrs>) => shallow(<Popup {...{children: '', ...props}} />);
  const mountPopup = (props?: Partial<PopupAttrs>) => mount<Popup>(<Popup {...{children: '', ...props}} />);

  it('should create component', () => {
    const popup = shallowPopup();
    popup.should.exist;
  });

  it('should allow pass DOM node as a target', () => {
    const targetNode = document.createElement('div');
    const instance = mountPopup({target: targetNode}).instance();
    const popupElement = instance.popup;
    (popupElement != null && targetNode.contains(popupElement)).should.be.true;
  });

  it('should attempt to close by pressing esc', () => {
    const onCloseAttempt = sandbox.stub();
    mountPopup({onCloseAttempt});

    simulateCombo('esc');

    onCloseAttempt.should.have.been.called;
  });

  describe('close by pointer down', () => {
    const downEvent = new PointerEvent('pointerdown', {
      bubbles: true,
      cancelable: false,
    });
    let clock: Sinon.SinonFakeTimers;

    beforeEach(() => {
      clock = sandbox.useFakeTimers({toFake: ['setTimeout']});
    });

    it('should attempt to close by pointer down outside the element', () => {
      const onCloseAttempt = sandbox.stub();
      mountPopup({onCloseAttempt});

      clock.tick(0);
      document.body.dispatchEvent(downEvent);
      onCloseAttempt.should.have.been.called;
    });

    it('should pass event to onCloseAttempt callback when closing by document pointer down event', () => {
      const onCloseAttempt = sandbox.stub();
      mountPopup({onCloseAttempt});

      clock.tick(0);
      document.body.dispatchEvent(downEvent);
      onCloseAttempt.should.have.been.calledWith(sinon.match({type: 'pointerdown'}));
    });

    it('should not close popup if popup hidden', () => {
      const onCloseAttempt = sandbox.stub();
      mountPopup({
        hidden: true,
        onCloseAttempt,
      });

      clock.tick(0);
      document.body.dispatchEvent(downEvent);
      onCloseAttempt.should.not.have.been.called;
    });

    it('should be closed by pointer down event outside the element after show', () => {
      const onCloseAttempt = sandbox.stub();
      const wrapper = mountPopup({
        onCloseAttempt,
      });

      wrapper.setProps({hidden: false}, () => {
        clock.tick(0);
        document.body.dispatchEvent(downEvent);
        onCloseAttempt.should.have.been.called;
      });
    });

    it("shouldn't be closed by pointer down event inside the element", () => {
      const onCloseAttempt = sandbox.stub();
      const instance = mountPopup({onCloseAttempt}).instance();

      clock.tick(0);
      instance.popup?.dispatchEvent(downEvent);
      onCloseAttempt.should.not.have.been.called;
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

      const instance = mountPopup({
        directions: [Popup.PopupProps.Directions.TOP_LEFT],
        anchorElement: element,
      }).instance();

      should.exist(instance.popup);
      const popupElement = instance.popup as HTMLElement;
      const elementOffset = getRect(element);

      parseInt(getStyles(popupElement).left, 10).should.equal(
        elementOffset.left + elementOffset.width - popupElement.offsetWidth,
      );
      parseInt(getStyles(popupElement).top, 10).should.equal(elementOffset.top - popupElement.offsetHeight);
    });

    it('should limit top by sidePadding if opens to the top', () => {
      const SIDE_PADDING = 8;
      element = document.createElement('div');
      element.setAttribute('style', 'position: absolute; top: 10px; left: 15px; width: 50px; height: 50px;');
      document.body.append(element);

      const instance = mountPopup({
        directions: [Popup.PopupProps.Directions.TOP_LEFT],
        anchorElement: element,
        sidePadding: SIDE_PADDING,
        children: <div style={{height: '300px'}}>{'foo'}</div>,
      }).instance();

      should.exist(instance.popup);
      getStyles(instance.popup as HTMLElement).top.should.equal(`${SIDE_PADDING}px`);
    });

    it('bottom-right corner', () => {
      element = document.createElement('div');
      element.setAttribute('style', 'position: absolute; top: 10px; left: 15px; width: 50px; height: 50px;');
      document.body.append(element);

      const instance = mountPopup({
        directions: [Popup.PopupProps.Directions.BOTTOM_RIGHT],
        anchorElement: element,
      }).instance();

      should.exist(instance.popup);
      const popupElement = instance.popup as HTMLElement;
      const elementOffset = getRect(element);

      parseInt(getStyles(popupElement).left, 10).should.equal(elementOffset.left);
      parseInt(getStyles(popupElement).top, 10).should.equal(elementOffset.top + elementOffset.height);
    });

    it('should add specified offset', () => {
      const OFFSET = 10;
      element = document.createElement('div');
      element.setAttribute('style', 'position: absolute; top: 10px; left: 15px; width: 50px; height: 50px;');
      document.body.append(element);

      const instance = mountPopup({
        directions: [Popup.PopupProps.Directions.BOTTOM_RIGHT],
        anchorElement: element,
        left: OFFSET,
        top: OFFSET,
      }).instance();

      should.exist(instance.popup);
      const popupElement = instance.popup as HTMLElement;
      const elementOffset = getRect(element);

      parseInt(getStyles(popupElement).left, 10).should.equal(elementOffset.left + OFFSET);
      parseInt(getStyles(popupElement).top, 10).should.equal(elementOffset.top + elementOffset.height + OFFSET);
    });

    it.skip('Should support minWidth = MinWidth.TARGET', () => {
      element = document.createElement('div');
      element.setAttribute('style', 'width: 50px; padding-left: 20px;');
      document.body.append(element);

      const instance = mountPopup({
        minWidth: MinWidth.TARGET,
        anchorElement: element,
        hidden: false,
      }).instance();

      should.exist(instance.popup);
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      parseInt(getStyles(instance.popup as HTMLElement).minWidth, 10).should.equal(70);
      element.remove();
    });

    it('Should support minWidth = number in pixels if anchor width is less than minWidth', () => {
      element = document.createElement('div');
      element.setAttribute('style', 'width: 50px;');
      document.body.append(element);

      const WIDTH = 345;
      const instance = mountPopup({
        minWidth: WIDTH,
        hidden: false,
        anchorElement: element,
      }).instance();

      should.exist(instance.popup);
      const popupElement = instance.popup as HTMLElement;
      parseInt(popupElement.style.minWidth, 10).should.equal(WIDTH);
    });

    it.skip('Should use width of anchor if it is bigger than minWidth', () => {
      const WIDTH = 345;

      element = document.createElement('div');
      element.setAttribute('style', `width: ${WIDTH}px;`);
      document.body.append(element);

      const instance = mountPopup({
        minWidth: 20,
        hidden: false,
        anchorElement: element,
      }).instance();

      should.exist(instance.popup);
      const popupElement = instance.popup as HTMLElement;
      parseInt(popupElement.style.minWidth, 10).should.equal(WIDTH);
    });
  });
});
