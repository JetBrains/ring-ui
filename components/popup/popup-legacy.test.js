/* eslint-disable func-names */

import {createElement} from 'react';
import {render} from 'react-dom';
import 'dom4';

import renderIntoDocument from 'render-into-document';
import simulateKeypress from 'simulate-keypress';
import TestUtils from 'react-addons-test-utils';
import {getStyles, getRect} from '../dom/dom';

import Popup from './popup';
import {Display} from './position';

describe('Popup Legacy', () => {
  it('should be closed by pressing esc', () => {
    const popup = renderIntoDocument(createElement(Popup, {legacy: true}));
    popup.show();
    simulateKeypress(null, 27); // Esc

    should.not.exist(popup.popup);
  });

  it('should remove all popups', done => {
    const popup1 = renderIntoDocument(createElement(Popup, {legacy: true}));
    popup1.show();

    const container = document.createElement('div');
    const anchor = document.createElement('div');
    container.append(anchor);
    document.body.append(container);

    const popup2 = Popup.renderPopup(createElement(Popup, {
      anchorElement: anchor
    }));

    Popup.hideAllPopups();

    setTimeout(() => {
      popup1.display.should.be.equals(Display.SHOWING);
      popup2.display.should.be.equals(Display.SHOWING);
      done();
    });
  });

  describe('close by click', () => {
    const click = document.createEvent('MouseEvent');
    click.initEvent('click', true, false);

    it('should be closed by click outside the element', function (done) {
      const onClose = this.sinon.stub();
      const popup = renderIntoDocument(createElement(Popup, {
        onClose,
        legacy: true
      }));

      setTimeout(() => {
        document.body.dispatchEvent(click);

        onClose.should.have.been.called;

        should.not.exist(popup.popup);

        done();
      });
    });

    it('should pass event to onClose callback when closing by clicking by document', function (done) {
      const onCloseStub = this.sinon.stub();
      const sinon = this.sinon;
      renderIntoDocument(createElement(Popup, {
        onClose: onCloseStub,
        legacy: true
      }));

      setTimeout(() => {
        document.body.dispatchEvent(click);
        onCloseStub.should.have.been.calledWith(sinon.match({type: 'click'}));
        done();
      });
    });

    it('shouldn\'t be closed by click outside the element after hide', function (done) {
      const onClose = this.sinon.stub();
      const popup = TestUtils.renderIntoDocument(createElement(Popup, {
        onClose,
        legacy: true
      }));

      setTimeout(() => {
        popup.hide();
        document.body.dispatchEvent(click);

        onClose.should.not.have.been.called;
        done();
      });
    });

    it('should be closed by click outside the element after show', function (done) {
      const onClose = this.sinon.stub();
      const popup = renderIntoDocument(createElement(Popup, {
        onClose,
        legacy: true
      }));
      popup.hide();
      popup.show();

      setTimeout(() => {
        document.body.dispatchEvent(click);

        onClose.should.have.been.called;
        done();
      });
    });

    it('shouldn\'n t be closed by click inside the element', done => {
      const popup = renderIntoDocument(createElement(Popup, null));

      setTimeout(() => {
        popup.popup.dispatchEvent(click);

        popup.popup.should.exist;
        done();
      });
    });
  });

  describe('positioning', () => {
    it('top-left direction', () => {
      const element = document.createElement('div');
      element.setAttribute('style', 'position: absolute; top: 10px; left: 15px; width: 50px; height: 50px;');
      document.body.append(element);

      const container = document.createElement('div');
      document.body.append(container);

      const popup = render(createElement(Popup, {
        directions: [Popup.PopupProps.Directions.TOP_LEFT],
        anchorElement: element,
        legacy: true
      }), container);

      popup.show();

      const popupElement = popup.popup;
      const elementOffset = getRect(element);

      parseInt(getStyles(popupElement).left, 10).should.equal(elementOffset.left + elementOffset.width - popupElement.clientWidth);
      parseInt(getStyles(popupElement).top, 10).should.equal(elementOffset.top - popupElement.clientHeight);
    });

    it('bottom-right corner', () => {
      const element = document.createElement('div');
      element.setAttribute('style', 'position: absolute; top: 10px; left: 15px; width: 50px; height: 50px;');
      document.body.append(element);

      const container = document.createElement('div');
      document.body.append(container);

      const popup = render(createElement(Popup, {
        directions: [Popup.PopupProps.Directions.BOTTOM_RIGHT],
        anchorElement: element,
        legacy: true
      }), container);

      popup.show();

      const popupElement = popup.popup;
      const elementOffset = getRect(element);

      parseInt(getStyles(popupElement).left, 10).should.equal(elementOffset.left);
      parseInt(getStyles(popupElement).top, 10).should.equal(elementOffset.top + elementOffset.height);
    });

    it('should add specified offset', () => {
      const OFFSET = 10;
      const element = document.createElement('div');
      element.setAttribute('style', 'position: absolute; top: 10px; left: 15px; width: 50px; height: 50px;');
      document.body.append(element);

      const container = document.createElement('div');
      document.body.append(container);

      const popup = render(createElement(Popup, {
        directions: [Popup.PopupProps.Directions.BOTTOM_RIGHT],
        anchorElement: element,
        left: OFFSET,
        top: OFFSET,
        legacy: true
      }), container);

      popup.show();

      const popupElement = popup.popup;
      const elementOffset = getRect(element);

      parseInt(getStyles(popupElement).left, 10).should.equal(elementOffset.left + OFFSET);
      parseInt(getStyles(popupElement).top, 10).should.equal(elementOffset.top + elementOffset.height + OFFSET);
    });

    it('Should support minWidth = target', () => {
      const element = document.createElement('div');
      element.setAttribute('style', 'width: 50px; padding-left: 20px;');
      document.body.append(element);

      const popup = renderIntoDocument(createElement(Popup, {
        minWidth: 'target',
        anchorElement: element
      }));

      parseInt(getStyles(popup.popup).minWidth, 10).should.equal(70);
      element.remove();
    });
  });
});
