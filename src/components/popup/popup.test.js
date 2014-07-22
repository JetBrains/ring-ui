describe('popup', function () {
  var $ = require('jquery');
  var React = require('react/addons');
  var PopupMixin = require('./popup-mixin.jsx');
  var Popup = require('./popup.jsx');

  function renderIntoDocument() {
    var container = document.createElement('div');
    return React.renderComponent(new Popup(null), container);
  }

  it('should create component', function () {
    var popup = renderIntoDocument();
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
    var popup = renderIntoDocument();
    var evt;

    try {
      evt = new CustomEvent('keydown');
    } catch(err) {
      evt = document.createEvent('KeyboardEvent');
      evt.initEvent('keydown', true, false);
    }

    evt.keyCode = 27;
    evt.key = 'Escape';
    document.body.dispatchEvent(evt);

    expect(popup.isMounted()).toEqual(false);
  });

  it ('should be closed by resizing window', function() {
    var popup = renderIntoDocument();
    var evt = document.createEvent('Event');
    evt.initEvent('resize', true, false);
    window.dispatchEvent(evt);

    expect(popup.isMounted()).toEqual(false);
  });

  describe('close by click', function() {
    var evt = document.createEvent('MouseEvent');
    evt.initEvent('click', true, false);

    it ('should be closed by click outside the element', function() {
      var popup = renderIntoDocument();
      document.body.dispatchEvent(evt);

      expect(popup.isMounted()).toEqual(false);
    });

    it ('shouldn\'n t be closed by click inside the element', function() {
      var popup = renderIntoDocument();
      popup.getDOMNode().dispatchEvent(evt);

      expect(popup.isMounted()).toEqual(true);
    });
  });

  describe('positioning', function() {
    it ('top-left angle', function() {
      var element = $('<div style="position: absolute; width: 50px; height: 50px;"></div>');
      var container = document.createElement('div');

      var popup = React.renderComponent(new Popup({
        angle: Popup.Angle.TOP_LEFT,
        anchorElement: element[0]
      }), container);

      var popupElement = popup.getDOMNode();
      var elementOffset = element.offset();

      expect(parseInt(popupElement.style.left)).toEqual(elementOffset.left);
      expect(parseInt(popupElement.style.top)).toEqual(elementOffset.top - $(popup.getDOMNode()).height());
    });

    it ('bottom-left angle', function() {
      var element = $('<div style="position: absolute; width: 50px; height: 50px;"></div>');
      var container = document.createElement('div');

      var popup = React.renderComponent(new Popup({
        angle: Popup.Angle.BOTTOM_LEFT,
        anchorElement: element[0]
      }), container);

      var popupElement = popup.getDOMNode();
      var elementOffset = element.offset();

      expect(parseInt(popupElement.style.left)).toEqual(elementOffset.left);
      expect(parseInt(popupElement.style.top)).toEqual(elementOffset.top + element.height());
    });
  });
});
