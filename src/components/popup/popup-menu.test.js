describe('popup-menu', function () {
  var React = require('react/addons');
  var PopupMenu = require('./popup-menu.jsx');

  function renderIntoDocument() {
    var container = document.createElement('div');
    return React.renderComponent(new PopupMenu(), container);
  }

  it('should create component', function () {
    var popup = renderIntoDocument();
    expect(popup).toBeDefined();
  });

  it('should be empty by default', function () {
    var popup = renderIntoDocument();

    expect(popup).toBeDefined();
    expect(popup.getDOMNode().tagName.toLowerCase()).toEqual('div');
    expect(popup.getDOMNode().firstChild.hasChildNodes()).toEqual(false);
  });

  describe('should render items', function() {

    it('should render for empty element', function () {
      var popup = renderIntoDocument();
      popup.setState({'data': [
        {}
      ]});

      expect(popup.getDOMNode().firstChild.firstChild).toHaveClass('ring-popup__item_action');
      expect(popup.getDOMNode().firstChild.firstChild.innerHTML).toEqual('');
    });

    it('should render popup item if type is not definded', function () {
      var popup = renderIntoDocument();
      popup.setState({'data': [
        {'label': 'Hello!'}
      ]});

      expect(popup.getDOMNode().firstChild.firstChild).toHaveClass('ring-popup__item_action');
      expect(popup.getDOMNode().firstChild.firstChild.innerHTML).toEqual('Hello!');
    });

    it('should render a if href defined', function () {
      var popup = renderIntoDocument();
      popup.setState({'data': [
        {'label': 'Hello!', 'href': 'http://www.jetbrains.com'}
      ]});

      expect(popup.getDOMNode().firstChild.firstChild).toHaveClass('ring-link');
      expect(popup.getDOMNode().firstChild.firstChild.innerHTML).toEqual('Hello!');
      expect(popup.getDOMNode().firstChild.firstChild.tagName.toLowerCase()).toEqual('a');
      expect(popup.getDOMNode().firstChild.firstChild.getAttribute('href')).toEqual('http://www.jetbrains.com');
    });

    it('should render a if url defined', function () {
      var popup = renderIntoDocument();
      popup.setState({'data': [
        {'label': 'Hello!', 'url': 'http://www.jetbrains.com'}
      ]});

      expect(popup.getDOMNode().firstChild.firstChild).toHaveClass('ring-link');
      expect(popup.getDOMNode().firstChild.firstChild.innerHTML).toEqual('Hello!');
      expect(popup.getDOMNode().firstChild.firstChild.tagName.toLowerCase()).toEqual('a');
      expect(popup.getDOMNode().firstChild.firstChild.getAttribute('href')).toEqual('http://www.jetbrains.com');
    });

    it('should render separator', function () {
      var popup = renderIntoDocument();
      popup.setState({'data': [
        {'type': PopupMenu.Type.SEPARATOR}
      ]});

      expect(popup.getDOMNode().firstChild.firstChild).toHaveClass('ring-popup__separator');
    });

    it('should render span if link without href', function () {
      var popup = renderIntoDocument();
      popup.setState({'data': [
        {'label': 'Hello!', 'type': PopupMenu.Type.MENU_LINK}
      ]});

      expect(popup.getDOMNode().firstChild.firstChild).toHaveClass('ring-link');
      expect(popup.getDOMNode().firstChild.firstChild.innerHTML).toEqual('Hello!');
      expect(popup.getDOMNode().firstChild.firstChild.tagName.toLowerCase()).toEqual('span');
    });

    it('should throw error on unknown type', function () {
      var popup = renderIntoDocument();

      expect(function () {
        popup.setState({'data': [
          {'label': 'Hello!', 'type': 'none'}
        ]});

        expect(popup.getDOMNode().firstChild.firstChild).toHaveClass('ring-link');
        expect(popup.getDOMNode().firstChild.firstChild.innerHTML).toEqual('Hello!');
        expect(popup.getDOMNode().firstChild.firstChild.tagName.toLowerCase()).toEqual('span');
      }).toThrow(new Error('Unknown menu element type: none'));
    });

  });

  it('should re-render content on change state', function () {
    var popup = renderIntoDocument();
    popup.setState({'data': [
      {'label': 'Hello!'}
    ]});

    expect(popup).toBeDefined();
    expect(popup.getDOMNode().tagName.toLowerCase()).toEqual('div');
    expect(popup.getDOMNode().firstChild.firstChild).toHaveClass('ring-popup__item');
  });

  it('should handle click', function () {

    var popup = renderIntoDocument();
    var clicked = false;
    popup.setState({'data': [
      {'label': 'Hello!', 'onClick': function() {
        clicked = true;
      }}
    ]});

    expect(popup.getDOMNode().firstChild.firstChild).toHaveClass('ring-popup__item');
    React.addons.TestUtils.Simulate.click(popup.getDOMNode().firstChild.firstChild);
    expect(clicked).toBe(true);
  });

});
