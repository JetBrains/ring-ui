/* eslint-disable func-names */

import 'dom4';
import {Component, createElement} from 'react';
import {renderIntoDocument} from 'react-dom/test-utils';

import {getRect, getStyles} from '../global/dom';

import Popup from './popup';
import {MinWidth} from './position';

import simulateCombo from 'simulate-combo';

function renderPopup(props) {
  return renderIntoDocument(createElement(Popup, props));
}

describe('Popup', () => {
  it('should create component', () => {
    const popup = renderPopup();
    popup.should.exist;
  });

  it('should attempt to close by pressing esc', function () {
    const onCloseAttempt = this.sinon.stub();
    renderPopup({onCloseAttempt});

    simulateCombo('esc');

    onCloseAttempt.should.have.been.called;
  });

  describe('close by click', () => {
    const click = document.createEvent('MouseEvent');
    click.initEvent('click', true, false);
    let clock;

    beforeEach(function () {
      clock = this.sinon.useFakeTimers();
    });

    afterEach(() => {
      clock.restore();
    });

    it('should attempt to close by click outside the element', function () {
      const onCloseAttempt = this.sinon.stub();
      renderPopup({onCloseAttempt});

      clock.tick();
      document.body.dispatchEvent(click);
      onCloseAttempt.should.have.been.called;
    });

    it('should pass event to onCloseAttempt callback when closing by clicking by document', function () {
      const sinon = this.sinon;
      const onCloseAttempt = sinon.stub();
      renderPopup({onCloseAttempt});

      clock.tick();
      document.body.dispatchEvent(click);
      onCloseAttempt.should.have.been.calledWith(sinon.match({type: 'click'}));
    });

    it('should not close popup if popup hidden', function () {
      const onCloseAttempt = this.sinon.stub();
      renderPopup({
        hidden: true,
        onCloseAttempt
      });

      clock.tick();
      document.body.dispatchEvent(click);
      onCloseAttempt.should.not.have.been.called;
    });

    it('should be closed by click outside the element after show', function () {
      const onCloseAttempt = this.sinon.stub();
      class Box extends Component {
        state = {hidden: true};

        render() {
          return createElement(Popup, {
            onCloseAttempt,
            ...this.state
          });
        }
      }
      const box = renderIntoDocument(createElement(Box));

      box.setState({hidden: false}, () => {
        clock.tick();
        document.body.dispatchEvent(click);
        onCloseAttempt.should.have.been.called;
      });
    });

    it('shouldn\'n t be closed by click inside the element', function () {
      const onCloseAttempt = this.sinon.stub();
      const popup = renderPopup({onCloseAttempt});

      clock.tick();
      popup.popup.dispatchEvent(click);
      onCloseAttempt.should.not.have.been.called;
    });
  });

  describe('positioning', () => {
    beforeEach(function () {
      this.sinon.stub(window, 'requestAnimationFrame').callsFake(cb => cb());
    });

    it('top-left direction', () => {
      const element = document.createElement('div');
      element.setAttribute(
        'style',
        'position: absolute; top: 10px; left: 15px; width: 50px; height: 50px;'
      );
      document.body.append(element);

      const popup = renderPopup({
        directions: [Popup.PopupProps.Directions.TOP_LEFT],
        anchorElement: element
      });

      const popupElement = popup.popup;
      const elementOffset = getRect(element);

      parseInt(getStyles(popupElement).left, 10).
        should.equal(elementOffset.left + elementOffset.width - popupElement.clientWidth);
      parseInt(getStyles(popupElement).top, 10).
        should.equal(elementOffset.top - popupElement.clientHeight);
    });

    it('bottom-right corner', () => {
      const element = document.createElement('div');
      element.setAttribute(
        'style',
        'position: absolute; top: 10px; left: 15px; width: 50px; height: 50px;'
      );
      document.body.append(element);

      const popup = renderPopup({
        directions: [Popup.PopupProps.Directions.BOTTOM_RIGHT],
        anchorElement: element
      });

      const popupElement = popup.popup;
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

      const popup = renderPopup({
        directions: [Popup.PopupProps.Directions.BOTTOM_RIGHT],
        anchorElement: element,
        left: OFFSET,
        top: OFFSET
      });

      const popupElement = popup.popup;
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

      const popup = renderPopup({
        minWidth: MinWidth.TARGET,
        anchorElement: element,
        hidden: false
      });

      // eslint-disable-next-line no-magic-numbers
      parseInt(getStyles(popup.popup).minWidth, 10).should.equal(70);
      element.remove();
    });

    it('Should support minWidth = some number in pixels', () => {
      const WIDTH = 345;
      const popup = renderPopup({minWidth: WIDTH, hidden: false});

      parseInt(popup.popup.style.minWidth, 10).should.equal(WIDTH);
    });
  });
});
