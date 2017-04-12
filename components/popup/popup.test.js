/* eslint-disable func-names */

import {Component, createElement} from 'react';
import 'dom4';

import renderIntoDocument from 'render-into-document';
import simulateCombo from 'simulate-combo';
import {getRect, getStyles} from '../global/dom';

import Popup from './popup';
import {MinWidth} from './position';

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

    it('should attempt to close by click outside the element', function (done) {
      const onCloseAttempt = this.sinon.stub();
      renderPopup({onCloseAttempt});

      setTimeout(() => {
        document.body.dispatchEvent(click);

        onCloseAttempt.should.have.been.called;

        done();
      });
    });

    it('should pass event to onCloseAttempt callback when closing by clicking by document', function (done) {
      const sinon = this.sinon;
      const onCloseAttempt = sinon.stub();
      renderPopup({onCloseAttempt});

      setTimeout(() => {
        document.body.dispatchEvent(click);
        onCloseAttempt.should.have.been.calledWith(sinon.match({type: 'click'}));
        done();
      });
    });

    it('should not close popup if popup hidden', function (done) {
      const onCloseAttempt = this.sinon.stub();
      renderPopup({
        hidden: true,
        onCloseAttempt
      });

      setTimeout(() => {
        document.body.dispatchEvent(click);
        onCloseAttempt.should.not.have.been.called;
        done();
      });
    });

    it('should be closed by click outside the element after show', function (done) {
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
        setTimeout(() => {
          document.body.dispatchEvent(click);

          onCloseAttempt.should.have.been.called;
          done();
        });
      });
    });

    it('shouldn\'n t be closed by click inside the element', function (done) {
      const onCloseAttempt = this.sinon.stub();
      const popup = renderPopup({onCloseAttempt});

      setTimeout(() => {
        popup.popup.dispatchEvent(click);

        onCloseAttempt.should.not.have.been.called;
        done();
      });
    });
  });

  describe('positioning', () => {
    beforeEach(function () {
      this.sinon.stub(window, 'requestAnimationFrame').callsFake(cb => cb());
    });

    it('top-left direction', () => {
      const element = document.createElement('div');
      element.setAttribute('style', 'position: absolute; top: 10px; left: 15px; width: 50px; height: 50px;');
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
      element.setAttribute('style', 'position: absolute; top: 10px; left: 15px; width: 50px; height: 50px;');
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
      element.setAttribute('style', 'position: absolute; top: 10px; left: 15px; width: 50px; height: 50px;');
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

      parseInt(getStyles(popup.popup).minWidth, 10).should.equal(70);
      element.remove();
    });

    it('Should support minWidth = some number in pixels', () => {
      const popup = renderPopup({minWidth: 345, hidden: false});

      parseInt(popup.popup.style.minWidth, 10).should.equal(345);
    });
  });
});
