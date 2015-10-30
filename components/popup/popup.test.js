import $ from 'jquery';
import {createElement} from 'react';
import {render} from 'react-dom';

import renderIntoDocument from 'render-into-document';
import simulateKeypress from 'simulate-keypress';
import TestUtils from 'react-addons-test-utils';

import Popup from './popup';

describe('Popup', function () {
  it('should create component', function () {
    const popup = renderIntoDocument(createElement(Popup, null));
    popup.should.exist;
  });

  it('should be closed by pressing esc', function () {
    const popup = renderIntoDocument(createElement(Popup, null));
    popup.show();
    simulateKeypress(null, 27); // Esc

    should.not.exist(popup.node);
  });

  it('should be closed by resizing window', function (done) {
    const popup = renderIntoDocument(createElement(Popup, null));
    const evt = document.createEvent('Event');
    evt.initEvent('resize', true, false);

    setTimeout(function () {
      window.dispatchEvent(evt);

      should.not.exist(popup.node);

      done();
    });
  });

  it('should save passed container', function () {
    const fixedContainer = document.createElement('div');
    fixedContainer.style.position = 'fixed';
    const anchor = document.createElement('div');
    $(fixedContainer).append(anchor);
    $('body').append(fixedContainer);

    const popup = Popup.renderPopup(createElement(Popup, {
      anchorElement: anchor
    }), anchor);

    popup.props.container.should.be.equal(fixedContainer);
  });

  describe('close by click', function () {
    const evt = document.createEvent('MouseEvent');
    evt.initEvent('click', true, false);

    it('should be closed by click outside the element', function (done) {
      const onClose = this.sinon.stub();
      const popup = renderIntoDocument(createElement(Popup, {
        onClose: onClose
      }));

      setTimeout(function () {
        document.body.dispatchEvent(evt);

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

      setTimeout(function () {
        document.body.dispatchEvent(evt);
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

      setTimeout(function () {
        document.body.dispatchEvent(evt);
        onCloseStub.should.not.have.been.called;
        done();
      });
    });

    it('shouldn\'t be closed by click outside the element after hide', function (done) {
      const onClose = this.sinon.stub();
      const popup = TestUtils.renderIntoDocument(createElement(Popup, {
        onClose: onClose
      }));

      setTimeout(function () {
        popup.hide();
        document.body.dispatchEvent(evt);

        onClose.should.not.have.been.called;
        done();
      });
    });

    it('shouldn\'t be closed by click outside the element after show', function (done) {
      const onClose = this.sinon.stub();
      const popup = renderIntoDocument(createElement(Popup, {
        onClose: onClose
      }));
      popup.hide();
      popup.show();

      setTimeout(function () {
        document.body.dispatchEvent(evt);

        onClose.should.have.been.called;
        done();
      });
    });

    it('shouldn\'n t be closed by click inside the element', function (done) {
      const popup = renderIntoDocument(createElement(Popup, null));

      setTimeout(function () {
        popup.node.dispatchEvent(evt);

        popup.node.should.exist;
        done();
      });
    });
  });

  describe('positioning', function () {
    it('top-left corner', function () {
      const element = $('<div style="position: absolute; top: 10px; left: 15px; width: 50px; height: 50px;"></div>');
      $('body').append(element);

      const container = document.createElement('div');
      $('body').append(container);

      const popup = render(createElement(Popup, {
        corner: Popup.PopupProps.Corner.TOP_LEFT,
        anchorElement: element[0]
      }), container);

      popup.show();

      const popupElement = popup.node;
      const elementOffset = element.offset();

      parseInt(popupElement.style.left, 10).should.equal(elementOffset.left);
      parseInt(popupElement.style.top, 10).should.equal(elementOffset.top - $(popup.node).height());
    });

    it('bottom-left corner', function () {
      const element = $('<div style="position: absolute; top: 10px; left: 15px; width: 50px; height: 50px;"></div>');
      $('body').append(element);

      const container = document.createElement('div');
      $('body').append(container);

      const popup = render(createElement(Popup, {
        corner: Popup.PopupProps.Corner.BOTTOM_LEFT,
        anchorElement: element[0]
      }), container);

      popup.show();

      const popupElement = popup.node;
      const elementOffset = element.offset();

      parseInt(popupElement.style.left, 10).should.equal(elementOffset.left);
      parseInt(popupElement.style.top, 10).should.equal(elementOffset.top + element.height());
    });

    it('Should support minWidth = target', function () {
      const $element = $('<div style="width: 50px; padding-left: 20px;"></div>').appendTo('body');

      const popup = renderIntoDocument(createElement(Popup, {
        minWidth: 'target',
        anchorElement: $element[0]
      }));

      parseInt(popup.node.style.minWidth, 10).should.equal(70);
      $element.remove();
    });

    it('Should support minWidth = some number in pixels', function () {
      const popup = renderIntoDocument(createElement(Popup, {minWidth: '345'}));

      parseInt(popup.node.style.minWidth, 10).should.equal(345);
    });
  });
});
