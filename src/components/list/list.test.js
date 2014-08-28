describe('list', function () {
  var $ = require('jquery');
  var React = require('react/addons');
  var List = require('./list');
  var list;

  beforeEach(function() {
    list = React.addons.TestUtils.renderIntoDocument(new List());
  });

  describe('should render items', function() {

    it('should render for empty element', function () {
      list.setProps({'data': [
        {}
      ]});

      $(list.getDOMNode().firstChild).should.have.class('ring-list__item_action');
      list.getDOMNode().firstChild.innerHTML.should.equal('');
    });

    it('should render list item if type is not definded', function () {
      list.setProps({'data': [
        {'label': 'Hello!'}
      ]});

      $(list.getDOMNode().firstChild).should.have.class('ring-list__item_action');
      list.getDOMNode().firstChild.innerHTML.should.equal('Hello!');
    });

    it('should render a if href defined', function () {
      list.setProps({'data': [
        {'label': 'Hello!', 'href': 'http://www.jetbrains.com'}
      ]});

      $(list.getDOMNode().firstChild).should.have.class('ring-link');
      list.getDOMNode().firstChild.innerHTML.should.equal('Hello!');
      list.getDOMNode().firstChild.tagName.toLowerCase().should.equal('a');
      list.getDOMNode().firstChild.getAttribute('href').should.equal('http://www.jetbrains.com');
    });

    it('should render a if url defined', function () {
      list.setProps({'data': [
        {'label': 'Hello!', 'url': 'http://www.jetbrains.com'}
      ]});

      $(list.getDOMNode().firstChild).should.have.class('ring-link');
      list.getDOMNode().firstChild.innerHTML.should.equal('Hello!');
      list.getDOMNode().firstChild.tagName.toLowerCase().should.equal('a');
      list.getDOMNode().firstChild.getAttribute('href').should.equal('http://www.jetbrains.com');
    });

    it('should render separator', function () {
      list.setProps({'data': [
        {'type': List.Type.SEPARATOR}
      ]});

      $(list.getDOMNode().firstChild).should.have.class('ring-list__separator');
    });

    it('should render span if link without href', function () {
      list.setProps({'data': [
        {'label': 'Hello!', 'type': List.Type.LINK}
      ]});

      $(list.getDOMNode().firstChild).should.have.class('ring-link');
      list.getDOMNode().firstChild.innerHTML.should.equal('Hello!');
      list.getDOMNode().firstChild.tagName.toLowerCase().should.equal('span');
    });

    it('should throw error on unknown type', function () {

      expect(function () {
        list.setProps({'data': [
          {'label': 'Hello!', 'type': 'none'}
        ]});

        $(list.getDOMNode().firstChild).should.have.class('ring-link');
        list.getDOMNode().firstChild.innerHTML.should.equal('Hello!');
        list.getDOMNode().firstChild.tagName.toLowerCase().should.equal('span');
      }).to.throw(Error, 'Unknown menu element type: none');
    });

  });
});