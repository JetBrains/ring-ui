describe('popup', function () {
  var $ = require('jQuery');
  var React = require('react/addons');
  var PopupMixin = require('./popup-mixin.jsx');
  var Popup = require('./popup.jsx');

  function renderIntoDocument(instance) {
    return React.renderComponent(instance, document.body);
  }

  it('should create component', function () {
    var popup = renderIntoDocument(new Popup());
    expect(popup).toBeDefined();
  });

  it ('should create react class, based on popup mixin', function() {
    var popupChild = React.createClass({
      mixins: [PopupMixin],
      getInternalContent: function() {
        return React.DOM.div(null, 'Child');
      }
    });

    expect(popupChild).toBeDefined();
    expect(popupChild.getPopupLayer).toBeDefined();
    expect(popupChild.Angle).toBeDefined();
  });

  it ('should be closed by pressing esc', function() {
    var popup = renderIntoDocument(new Popup());
    var evt = document.createEvent('KeyboardEvent');
    evt.initEvent('keydown', true, false);
    evt.keyCode = 27;
    evt.key = 'Escape';
    document.body.dispatchEvent(evt);

    expect(popup.getDOMNode).toThrow();
  });

  it ('should be closed by resizing window', function() {
    var popup = renderIntoDocument(new Popup());
    var evt = document.createEvent('Event');
    evt.initEvent('resize', true, false);
    window.dispatchEvent(evt);

    expect(popup.getDOMNode).toThrow();
  });

  describe('close by click', function() {
    var container = document.createElement('div');
    document.body.appendChild(container);

    var evt = document.createEvent('MouseEvent');
    evt.initEvent('click', true, false);

    it ('should be closed by click outside the element', function() {
      var popup = React.renderComponent(new Popup(null), container);
      document.body.dispatchEvent(evt);

      expect(popup.getDOMNode).toThrow();
    });

    it ('shouldn\'n t be closed by click inside the element', function() {
      var popup = React.renderComponent(new Popup(null), container);
      popup.getDOMNode().dispatchEvent(evt);

      expect(popup.getDOMNode()).toBeDefined();
    });
  });

  describe('positioning', function() {
    var element = $('<div style="position: absolute; left: 50px; top: 50px; width: 50px; height: 50px;"></div>');

    it ('top-left angle', function() {
      var popup = React.renderComponent(new Popup({
        angle: Popup.Angle.TOP_LEFT,
        anchorElement: element[0]
      }), document.body);

      var popupOffset = $(popup.getDOMNode()).offset();
      var elementOffset = element.offset();

      expect(popupOffset.left).toEqual(elementOffset.left);
      expect(popupOffset.top).toEqual(elementOffset.top);
    });

    it ('bottom-left angle', function() {
      var popup = React.renderComponent(new Popup({
        angle: Popup.Angle.BOTTOM_LEFT,
        anchorElement: element[0]
      }), document.body);

      var popupOffset = $(popup.getDOMNode()).offset();
      var elementOffset = element.offset();

      expect(popupOffset.left).toEqual(elementOffset.left);
      expect(popupOffset.top).toEqual(elementOffset.top + element.height());
    });
  });
});
