var $ = require('jquery');
var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var Popup = require('./popup');
var simulateKeypress = require('simulate-keypress');

describe('Popup', function () {

  it('should create component', function () {
    var popup = TestUtils.renderIntoDocument(new Popup(null));
    popup.should.exist;
  });

  it('should create react class, based on popup mixin', function() {
    var popupChild = React.createClass({
      mixins: [Popup.Mixin],
      getInternalContent: function() {
        return React.DOM.div(null, 'Child');
      }
    });

    popupChild.should.exist;
    popupChild.PopupProps.Corner.should.exist;
  });

  it('should be closed by pressing esc', function() {
    var popup = TestUtils.renderIntoDocument(new Popup(null));

    simulateKeypress(null, 27); // Esc

    popup.isMounted().should.be.false;
  });

  it('should be closed by resizing window', function() {
    var popup = TestUtils.renderIntoDocument(new Popup(null));
    var evt = document.createEvent('Event');
    evt.initEvent('resize', true, false);
    window.dispatchEvent(evt);

    popup.isMounted().should.be.false;
  });

  describe('close by click', function() {
    var evt = document.createEvent('MouseEvent');
    evt.initEvent('click', true, false);

    it('should be closed by click outside the element', function() {
      var onClose = this.sinon.stub();
      var popup = TestUtils.renderIntoDocument(new Popup({
        onClose: onClose
      }));

      document.body.dispatchEvent(evt);

      onClose.should.have.been.called;
      popup.isMounted().should.be.false;
    });

    it('shouldn\'t be closed by click outside the element after hide', function() {
      var onClose = this.sinon.stub();
      var popup = TestUtils.renderIntoDocument(new Popup({
        onClose: onClose
      }));

      popup.hide();
      document.body.dispatchEvent(evt);

      onClose.should.not.have.been.called;
    });

    it('shouldn\'t be closed by click outside the element after show', function() {
      var onClose = this.sinon.stub();
      var popup = TestUtils.renderIntoDocument(new Popup({
        onClose: onClose
      }));

      popup.hide();
      popup.show();
      document.body.dispatchEvent(evt);

      onClose.should.have.been.called;
    });

    it('shouldn\'n t be closed by click inside the element', function() {
      var popup = TestUtils.renderIntoDocument(new Popup(null));
      popup.getDOMNode().dispatchEvent(evt);

      popup.isMounted().should.be.true;
    });
  });

  describe('positioning', function() {
    it('top-left corner', function() {
      var element = $('<div style="position: absolute; top: 10px; left: 15px; width: 50px; height: 50px;"></div>');
      $('body').append(element);

      var container = document.createElement('div');
      $('body').append(container);

      var popup = React.renderComponent(new Popup({
        corner: Popup.PopupProps.Corner.TOP_LEFT,
        anchorElement: element[0]
      }), container);

      popup.show();

      var popupElement = popup.getDOMNode();
      var elementOffset = element.offset();

      parseInt(popupElement.style.left, 10).should.equal(elementOffset.left);
      parseInt(popupElement.style.top, 10).should.equal(elementOffset.top - $(popup.getDOMNode()).height());
    });

    it('bottom-left corner', function() {
      var element = $('<div style="position: absolute; top: 10px; left: 15px; width: 50px; height: 50px;"></div>');
      $('body').append(element);

      var container = document.createElement('div');
      $('body').append(container);

      var popup = React.renderComponent(new Popup({
        corner: Popup.PopupProps.Corner.BOTTOM_LEFT,
        anchorElement: element[0]
      }), container);

      popup.show();

      var popupElement = popup.getDOMNode();
      var elementOffset = element.offset();

      parseInt(popupElement.style.left, 10).should.equal(elementOffset.left);
      parseInt(popupElement.style.top, 10).should.equal(elementOffset.top + element.height());
    });

    it('Should support minWidth = target', function () {
      var element = $('<div style="width: 50px;"></div>');

      var popup = TestUtils.renderIntoDocument(new Popup({
        minWidth: 'target',
        anchorElement: element[0]
      }));

      parseInt(popup.getDOMNode().style.minWidth, 10).should.equal(element.width());
    });

    it('Should support minWidth = some number in pixels', function () {
      var popup = TestUtils.renderIntoDocument(new Popup({minWidth: '345'}));

      parseInt(popup.getDOMNode().style.minWidth, 10).should.equal(345);
    });
  });
});
