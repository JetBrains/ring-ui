import {createElement} from 'react';
import {render} from 'react-dom';
import 'dom4';

import renderIntoDocument from 'render-into-document';
import simulateKeypress from 'simulate-keypress';
import TestUtils from 'react-addons-test-utils';
import {getStyles, getRect} from '../dom/dom';

import Popup from './popup';

describe('Popup', () => {
  it('should create component', () => {
    const popup = renderIntoDocument(createElement(Popup, null));
    popup.should.exist;
  });

  it('should be closed by pressing esc', () => {
    const popup = renderIntoDocument(createElement(Popup, null));
    popup.show();
    simulateKeypress(null, 27); // Esc

    should.not.exist(popup.node);
  });

  it('should call callback after rendering', done => {
    // Timeout will be exceeded when done isn't called
    Popup.renderPopup(createElement(Popup, null), {onRender: done});
  });

  it('should put popup in custom container if passed', () => {
    const container = document.createElement('div');

    Popup.renderPopup(createElement(Popup, null), {container});

    container.should.not.be.empty;
  });

  it('should be closed by resizing window', done => {
    const popup = renderIntoDocument(createElement(Popup, null));
    const resize = document.createEvent('Event');
    resize.initEvent('resize', true, false);

    setTimeout(() => {
      window.dispatchEvent(resize);

      should.not.exist(popup.node);

      done();
    });
  });

  it('should save passed container', () => {
    const fixedContainer = document.createElement('div');
    fixedContainer.style.position = 'fixed';
    const anchor = document.createElement('div');
    fixedContainer.append(anchor);
    document.body.append(fixedContainer);

    const popup = Popup.renderPopup(createElement(Popup, {
      anchorElement: anchor
    }));

    popup.props.container.should.be.equal(fixedContainer);
  });

  describe('close by click', () => {
    const click = document.createEvent('MouseEvent');
    click.initEvent('click', true, false);

    it('should be closed by click outside the element', function (done) {
      const onClose = this.sinon.stub();
      const popup = renderIntoDocument(createElement(Popup, {
        onClose
      }));

      setTimeout(() => {
        document.body.dispatchEvent(click);

        onClose.should.have.been.called;

        should.not.exist(popup.node);

        done();
      });
    });

    it('should pass event to onClose callback when closing by clicking by document', function (done) {
      const onCloseStub = this.sinon.stub();
      const sinon = this.sinon;
      renderIntoDocument(createElement(Popup, {
        onClose: onCloseStub
      }));

      setTimeout(() => {
        document.body.dispatchEvent(click);
        onCloseStub.should.have.been.calledWith(sinon.match({type: 'click'}));
        done();
      });
    });

    it('should not close popup if popup hidden', function (done) {
      const onCloseStub = this.sinon.stub();
      renderIntoDocument(createElement(Popup, {
        hidden: true,
        onClose: onCloseStub
      }));

      setTimeout(() => {
        document.body.dispatchEvent(click);
        onCloseStub.should.not.have.been.called;
        done();
      });
    });

    it('shouldn\'t be closed by click outside the element after hide', function (done) {
      const onClose = this.sinon.stub();
      const popup = TestUtils.renderIntoDocument(createElement(Popup, {
        onClose
      }));

      setTimeout(() => {
        popup.hide();
        document.body.dispatchEvent(click);

        onClose.should.not.have.been.called;
        done();
      });
    });

    it('shouldn\'t be closed by click outside the element after show', function (done) {
      const onClose = this.sinon.stub();
      const popup = renderIntoDocument(createElement(Popup, {
        onClose
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
        popup.node.dispatchEvent(click);

        popup.node.should.exist;
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
        anchorElement: element
      }), container);

      popup.show();

      const popupElement = popup.node;
      const elementOffset = getRect(element);

      parseInt(getStyles(popupElement).left, 10).should.equal(elementOffset.left + elementOffset.width - popup.node.clientWidth);
      parseInt(getStyles(popupElement).top, 10).should.equal(elementOffset.top - popup.node.clientHeight);
    });

    it('bottom-right corner', () => {
      const element = document.createElement('div');
      element.setAttribute('style', 'position: absolute; top: 10px; left: 15px; width: 50px; height: 50px;');
      document.body.append(element);

      const container = document.createElement('div');
      document.body.append(container);

      const popup = render(createElement(Popup, {
        directions: [Popup.PopupProps.Directions.BOTTOM_RIGHT],
        anchorElement: element
      }), container);

      popup.show();

      const popupElement = popup.node;
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
        top: OFFSET
      }), container);

      popup.show();

      const popupElement = popup.node;
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

      parseInt(getStyles(popup.node).minWidth, 10).should.equal(70);
      element.remove();
    });

    it('Should support minWidth = some number in pixels', () => {
      const popup = renderIntoDocument(createElement(Popup, {minWidth: '345'}));

      parseInt(popup.node.style.minWidth, 10).should.equal(345);
    });
  });
});
