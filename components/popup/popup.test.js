import React from 'react';
import {shallow, mount} from 'enzyme';

import {getRect, getStyles} from '../global/dom';
import simulateCombo from '../../test-helpers/simulate-combo';

import Popup from './popup';
import {MinWidth} from './position';

describe('Popup', () => {
  const shallowPopup = props => shallow(<Popup {...props}/>);
  const mountPopup = props => mount(<Popup {...props}/>);

  it('should create component', () => {
    const popup = shallowPopup();
    popup.should.exist;
  });

  it('should attempt to close by pressing esc', () => {
    const onCloseAttempt = sandbox.stub();
    mountPopup({onCloseAttempt});

    simulateCombo('esc');

    onCloseAttempt.should.have.been.called;
  });

  describe('close by click', () => {
    const click = document.createEvent('MouseEvent');
    click.initEvent('click', true, false);
    let clock;

    beforeEach(() => {
      clock = sandbox.useFakeTimers({toFake: ['setTimeout']});
    });

    it('should attempt to close by click outside the element', () => {
      const onCloseAttempt = sandbox.stub();
      mountPopup({onCloseAttempt});

      clock.tick();
      document.body.dispatchEvent(click);
      onCloseAttempt.should.have.been.called;
    });

    it('should pass event to onCloseAttempt callback when closing by clicking by document', () => {
      const onCloseAttempt = sandbox.stub();
      mountPopup({onCloseAttempt});

      clock.tick();
      document.body.dispatchEvent(click);
      onCloseAttempt.should.have.been.calledWith(sinon.match({type: 'click'}));
    });

    it('should not close popup if popup hidden', () => {
      const onCloseAttempt = sandbox.stub();
      mountPopup({
        hidden: true,
        onCloseAttempt
      });

      clock.tick();
      document.body.dispatchEvent(click);
      onCloseAttempt.should.not.have.been.called;
    });

    it('should be closed by click outside the element after show', () => {
      const onCloseAttempt = sandbox.stub();
      const wrapper = mountPopup({
        onCloseAttempt
      });

      wrapper.setProps({hidden: false}, () => {
        clock.tick();
        document.body.dispatchEvent(click);
        onCloseAttempt.should.have.been.called;
      });
    });

    it('shouldn\'t be closed by click inside the element', () => {
      const onCloseAttempt = sandbox.stub();
      const instance = mountPopup({onCloseAttempt}).instance();

      clock.tick();
      instance.popup.dispatchEvent(click);
      onCloseAttempt.should.not.have.been.called;
    });
  });

  describe('positioning', () => {
    beforeEach(() => {
      sandbox.stub(window, 'requestAnimationFrame').callsFake(cb => cb());
    });

    it('top-left direction', () => {
      const element = document.createElement('div');
      element.setAttribute(
        'style',
        'position: absolute; top: 10px; left: 15px; width: 50px; height: 50px;'
      );
      document.body.append(element);

      const instance = mountPopup({
        directions: [Popup.PopupProps.Directions.TOP_LEFT],
        anchorElement: element
      }).instance();

      const popupElement = instance.popup;
      const elementOffset = getRect(element);

      parseInt(getStyles(popupElement).left, 10).
        should.equal(elementOffset.left + elementOffset.width - popupElement.clientWidth);
      parseInt(getStyles(popupElement).top, 10).
        should.equal(elementOffset.top - popupElement.clientHeight);
    });

    it('should limit top by sidePadding if opens to the top', () => {
      const SIDE_PADDING = 8;
      const element = document.createElement('div');
      element.setAttribute(
        'style',
        'position: absolute; top: 10px; left: 15px; width: 50px; height: 50px;'
      );
      document.body.append(element);

      const instance = mountPopup({
        directions: [Popup.PopupProps.Directions.TOP_LEFT],
        anchorElement: element,
        sidePadding: SIDE_PADDING,
        children: <div style={{height: '300px'}}>{'foo'}</div>
      }).instance();

      getStyles(instance.popup).top.should.equal(`${SIDE_PADDING}px`);
    });

    it('bottom-right corner', () => {
      const element = document.createElement('div');
      element.setAttribute(
        'style',
        'position: absolute; top: 10px; left: 15px; width: 50px; height: 50px;'
      );
      document.body.append(element);

      const instance = mountPopup({
        directions: [Popup.PopupProps.Directions.BOTTOM_RIGHT],
        anchorElement: element
      }).instance();

      const popupElement = instance.popup;
      const elementOffset = getRect(element);

      parseInt(getStyles(popupElement).left, 10).
        should.equal(elementOffset.left);
      parseInt(getStyles(popupElement).top, 10).
        should.equal(elementOffset.top + elementOffset.height);
    });

    it('should add specified offset', () => {
      const OFFSET = 10;
      const element = document.createElement('div');
      element.setAttribute(
        'style',
        'position: absolute; top: 10px; left: 15px; width: 50px; height: 50px;'
      );
      document.body.append(element);

      const instance = mountPopup({
        directions: [Popup.PopupProps.Directions.BOTTOM_RIGHT],
        anchorElement: element,
        left: OFFSET,
        top: OFFSET
      }).instance();

      const popupElement = instance.popup;
      const elementOffset = getRect(element);

      parseInt(getStyles(popupElement).left, 10).
        should.equal(elementOffset.left + OFFSET);
      parseInt(getStyles(popupElement).top, 10).
        should.equal(elementOffset.top + elementOffset.height + OFFSET);
    });

    it('Should support minWidth = MinWidth.TARGET', () => {
      const element = document.createElement('div');
      element.setAttribute('style', 'width: 50px; padding-left: 20px;');
      document.body.append(element);

      const instance = mountPopup({
        minWidth: MinWidth.TARGET,
        anchorElement: element,
        hidden: false
      }).instance();

      // eslint-disable-next-line no-magic-numbers
      parseInt(getStyles(instance.popup).minWidth, 10).should.equal(70);
      element.remove();
    });

    it('Should support minWidth = number in pixels if anchor width is less than minWidth', () => {
      const anchorElement = document.createElement('div');
      anchorElement.setAttribute('style', 'width: 50px;');
      document.body.append(anchorElement);

      const WIDTH = 345;
      const instance = mountPopup({
        minWidth: WIDTH, hidden: false, anchorElement
      }).instance();

      parseInt(instance.popup.style.minWidth, 10).should.equal(WIDTH);
    });

    it('Should use width of anchor if it is bigger than minWidth', () => {
      const WIDTH = 345;

      const anchorElement = document.createElement('div');
      anchorElement.setAttribute('style', `width: ${WIDTH}px;`);
      document.body.append(anchorElement);

      const instance = mountPopup({
        minWidth: 20, hidden: false, anchorElement
      }).instance();

      parseInt(instance.popup.style.minWidth, 10).should.equal(WIDTH);
    });
  });
});
