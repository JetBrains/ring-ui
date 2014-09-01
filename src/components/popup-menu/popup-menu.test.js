describe('popup-menu', function () {
  var $ = require('jquery');
  var React = require('react/addons');
  var PopupMenu = require('./popup-menu');
  var popup;

  beforeEach(function() {
    popup = React.addons.TestUtils.renderIntoDocument(new PopupMenu());
  });

  it('should create component', function () {
    popup.should.exist;
  });

  it('should be empty by default', function () {
    popup.getDOMNode().tagName.toLowerCase().should.equal('div');
    popup.getDOMNode().firstChild.hasChildNodes().should.equal(false);
  });

  describe('should render items', function() {

    it('should render for empty element', function () {
      popup.setState({'data': [
        {}
      ]});

      $(popup.getDOMNode().firstChild.firstChild).should.have.class('ring-popup__item_action');
      popup.getDOMNode().firstChild.firstChild.innerHTML.should.equal('');
    });

    it('should render popup item if type is not definded', function () {
      popup.setState({'data': [
        {'label': 'Hello!'}
      ]});

      $(popup.getDOMNode().firstChild.firstChild).should.have.class('ring-popup__item_action');
      popup.getDOMNode().firstChild.firstChild.innerHTML.should.equal('Hello!');
    });

    it('should render a if href defined', function () {
      popup.setState({'data': [
        {'label': 'Hello!', 'href': 'http://www.jetbrains.com'}
      ]});

      $(popup.getDOMNode().firstChild.firstChild).should.have.class('ring-link');
      popup.getDOMNode().firstChild.firstChild.innerHTML.should.equal('Hello!');
      popup.getDOMNode().firstChild.firstChild.tagName.toLowerCase().should.equal('a');
      popup.getDOMNode().firstChild.firstChild.getAttribute('href').should.equal('http://www.jetbrains.com');
    });

    it('should render a if url defined', function () {
      popup.setState({'data': [
        {'label': 'Hello!', 'url': 'http://www.jetbrains.com'}
      ]});

      $(popup.getDOMNode().firstChild.firstChild).should.have.class('ring-link');
      popup.getDOMNode().firstChild.firstChild.innerHTML.should.equal('Hello!');
      popup.getDOMNode().firstChild.firstChild.tagName.toLowerCase().should.equal('a');
      popup.getDOMNode().firstChild.firstChild.getAttribute('href').should.equal('http://www.jetbrains.com');
    });

    it('should render separator', function () {
      popup.setState({'data': [
        {'type': PopupMenu.Type.SEPARATOR}
      ]});

      $(popup.getDOMNode().firstChild.firstChild).should.have.class('ring-popup__separator');
    });

    it('should render span if link without href', function () {
      popup.setState({'data': [
        {'label': 'Hello!', 'type': PopupMenu.Type.MENU_LINK}
      ]});

      $(popup.getDOMNode().firstChild.firstChild).should.have.class('ring-link');
      popup.getDOMNode().firstChild.firstChild.innerHTML.should.equal('Hello!');
      popup.getDOMNode().firstChild.firstChild.tagName.toLowerCase().should.equal('span');
    });

    it('should throw error on unknown type', function () {

      expect(function () {
        popup.setState({'data': [
          {'label': 'Hello!', 'type': 'none'}
        ]});

        $(popup.getDOMNode().firstChild.firstChild).should.have.class('ring-link');
        popup.getDOMNode().firstChild.firstChild.innerHTML.should.equal('Hello!');
        popup.getDOMNode().firstChild.firstChild.tagName.toLowerCase().should.equal('span');
      }).to.throw(Error, 'Unknown menu element type: none');
    });

  });

  it('should re-render content on change state', function () {
    popup.setState({'data': [
      {'label': 'Hello!'}
    ]});

    popup.should.exist;
    popup.getDOMNode().tagName.toLowerCase().should.equal('div');
    $(popup.getDOMNode().firstChild.firstChild).should.have.class('ring-popup__item');
  });

  it('should handle click', function () {
    var clicked = sinon.stub();

    popup.setState({'data': [
      {'label': 'Hello!', 'onClick': clicked}
    ]});

    $(popup.getDOMNode().firstChild.firstChild).should.have.class('ring-popup__item');
    React.addons.TestUtils.Simulate.click(popup.getDOMNode().firstChild.firstChild);
    clicked.should.have.been.called;
  });

});
